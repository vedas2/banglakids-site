/* Printables Engine — renders illustrated sentences in card grid */

function mountPrintables(container, data) {
    const cardsHtml = data.map((item, idx) => `
        <div class="printable-card">
            <div class="printable-image-placeholder" data-image-id="${item.id}">
                🖼️ [${item.imageAlt}]
            </div>
            <div class="printable-sentence">${item.sentence}</div>
            <div class="printable-sentence-en">${item.sentenceEn}</div>
        </div>
    `).join('');

    container.innerHTML = `
        <div class="printables-container">
            <div class="printables-header">
                <h1>বাংলাকিডস — মুদ্রণযোগ্য</h1>
                <p>Print these cards and cut into small pages</p>
                <button class="print-button" onclick="window.print()">🖨️ Print</button>
            </div>
            <div class="printables-grid">
                ${cardsHtml}
            </div>
        </div>
    `;

    return function unmount() {
        container.innerHTML = '';
    };
}
