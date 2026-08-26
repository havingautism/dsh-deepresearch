/** Read live Agent assistant text from the session log, not nonexistent `.messages`. */
/** Flatten text out of a message content payload. */
export function messageText(content) {
    if (typeof content === 'string')
        return content;
    if (!Array.isArray(content))
        return '';
    return content.map(block => typeof block === 'string' ? block : String(block.text ?? '')).join('');
}
/** Latest assembled assistant prose, or in-flight stream chunks if the message is not on the surface yet. */
export function assistantTextFromSession(session) {
    const messages = session.deriveMessages();
    for (let index = messages.length - 1; index >= 0; index -= 1) {
        const message = messages[index];
        if (message.role !== 'assistant')
            continue;
        const text = messageText(message.content);
        if (text !== '')
            return text;
    }
    return inFlightAssistantText(session.events);
}
/** Latest assistant text for a live generation Agent. */
export function lastAssistantText(handle) {
    return assistantTextFromSession(handle.agent.session);
}
function inFlightAssistantText(events) {
    let parts = [];
    for (const event of events) {
        if (event.type === 'step/start')
            parts = [];
        if (event.type === 'assistant/chunk') {
            const chunk = event.data?.chunk;
            if (chunk?.type === 'text-delta' && chunk.text)
                parts.push(chunk.text);
        }
        if (event.type === 'assistant/message') {
            const content = event.data?.message?.content;
            const text = messageText(content);
            if (text !== '')
                return text;
        }
    }
    return parts.join('');
}
function sessionIdOf(value) {
    return typeof value === 'string' ? value : String(value);
}
/** Stream draft updates from `session/event` plus a deriveMessages poll. */
export function watchDraft(handle, onDraft, maxChars = 4000) {
    let last = '';
    let streamed = '';
    let timer;
    const session = handle.agent.session;
    const id = sessionIdOf(session.id);
    const push = (text) => {
        const next = text.trim();
        if (next === '' || next === last)
            return;
        last = next;
        onDraft(next.slice(0, maxChars));
    };
    const emit = () => { push(streamed || lastAssistantText(handle)); };
    const schedule = () => {
        if (timer !== undefined)
            return;
        timer = setTimeout(() => { timer = undefined; emit(); }, 80);
    };
    const applyEvent = (event) => {
        if (event.type === 'assistant/chunk') {
            const chunk = event.data?.chunk;
            if (chunk?.type === 'text-delta' && chunk.text) {
                streamed += chunk.text;
                schedule();
            }
            return;
        }
        if (event.type === 'assistant/message') {
            const text = messageText(event.data?.message?.content);
            if (text !== '') {
                streamed = text;
                emit();
            }
        }
    };
    const offEvent = handle.agent.ctx.on('session/event', (live, event) => {
        if (sessionIdOf(live.id ?? '') !== id)
            return;
        applyEvent(event);
    });
    const poll = setInterval(emit, 200);
    emit();
    return () => {
        if (timer !== undefined)
            clearTimeout(timer);
        clearInterval(poll);
        offEvent();
    };
}
//# sourceMappingURL=assistant-text.js.map