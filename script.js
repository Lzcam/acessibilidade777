document.addEventListener("DOMContentLoaded", () => {
    const readButton = document.getElementById("toggleReadMode");
    const content = document.getElementById("content-to-read");
    const increaseButton = document.getElementById("increaseText");
    const decreaseButton = document.getElementById("decreaseText");
    const contrastButton = document.getElementById("toggleContrast");

    let isReading = false;
    let currentUtterance = null;
    let textScale = 1;

    // Recurso de acessibilidade: leitura de tela pelo navegador.
    if (!("speechSynthesis" in window)) {
        readButton.disabled = true;
        readButton.textContent = "Leitura indisponível";
        readButton.setAttribute("aria-label", "Leitura em voz alta indisponível neste navegador");
    }

    readButton.addEventListener("click", () => {
        if (isReading) {
            window.speechSynthesis.cancel();
            finalizarLeitura();
            return;
        }

        lerConteudoCompleto();
    });

    function lerConteudoCompleto() {
        const textoCompleto = content.innerText.trim();

        if (!textoCompleto) return;

        window.speechSynthesis.cancel();

        currentUtterance = new SpeechSynthesisUtterance(textoCompleto);
        currentUtterance.lang = "pt-BR";
        currentUtterance.rate = 1;
        currentUtterance.pitch = 1;

        currentUtterance.onstart = () => {
            isReading = true;
            readButton.textContent = "⏹️ Parar Leitura";
            readButton.setAttribute("aria-pressed", "true");
        };

        currentUtterance.onend = finalizarLeitura;
        currentUtterance.onerror = finalizarLeitura;

        window.speechSynthesis.speak(currentUtterance);
    }

    function finalizarLeitura() {
        isReading = false;
        readButton.textContent = "🔊 Ler Conteúdo";
        readButton.setAttribute("aria-pressed", "false");
        currentUtterance = null;
    }

    // Protótipo interativo: aumenta e diminui a fonte sem recarregar a página.
    increaseButton.addEventListener("click", () => {
        if (textScale < 1.4) {
            textScale += 0.1;
            atualizarFonte();
        }
    });

    decreaseButton.addEventListener("click", () => {
        if (textScale > 0.9) {
            textScale -= 0.1;
            atualizarFonte();
        }
    });

    function atualizarFonte() {
        document.documentElement.style.setProperty("--text-scale", textScale.toFixed(1));
    }

    // Acessibilidade: alto contraste.
    contrastButton.addEventListener("click", () => {
        const enabled = document.body.classList.toggle("high-contrast");
        contrastButton.setAttribute("aria-pressed", String(enabled));
    });
});
