import QrScanner from "https://nimiq.github.io/qr-scanner/qr-scanner.min.js";   
 
 document.addEventListener("DOMContentLoaded", function() {
    const botaoAnalisarArquivo = document.getElementById('botaoAnalisarArquivo');
    const containerQRCODE = document.querySelector('.containerQRCODE');

    let visivel = false;

    botaoAnalisarArquivo.addEventListener('click', function() {
        if (!visivel) {
            containerQRCODE.style.display = 'block';
            visivel = true; 
        } else {
            containerQRCODE.style.display = 'none'; 
            visivel = false;
        }
    });
});                     
      
const containerCropper = document.getElementById('containerCropper');
const previaCropper = document.getElementById('previaCropper');
const botaoRecortar = document.getElementById('botaoRecortar');
const botaoDecodificar = document.getElementById('botaoDecodificar');
const inputImagem = document.getElementById('inputImagem');
const resultado = document.getElementById('resultado');

let recortador;

inputImagem.addEventListener('change', selecionarImagem);

function selecionarImagem(evento) {
  const arquivo = evento.target.files[0];
  if (arquivo) {
    const leitor = new FileReader();
    leitor.onload = function(evento) {
      previaCropper.onload = function() {
        containerCropper.style.display = 'block';
        botaoRecortar.style.display = 'block';
      };
      previaCropper.src = evento.target.result;
    };
    leitor.readAsDataURL(arquivo);
  }
}

botaoRecortar.addEventListener('click', recortarImagem);

function recortarImagem() {
  recortador = new Cropper(previaCropper, {
    aspectRatio: 1,
    viewMode: 1,
    preview    : '#previaCropper'
  });  
}  

function setResult(result) {
  const recipientKeyInput = document.getElementById('recipient-key');
  if (result.data) {
    recipientKeyInput.value = result.data;
    recipientKeyInput.style.color = 'teal';
    clearTimeout(recipientKeyInput.highlightTimeout);
    recipientKeyInput.highlightTimeout = setTimeout(() => recipientKeyInput.style.color = 'inherit', 100);
  } else {
    recipientKeyInput.value = 'Não foi possível decodificar o código QR.';
    recipientKeyInput.style.color = 'red';
  }
}

botaoDecodificar.addEventListener('click', decodificarQRCode);

function decodificarQRCode() {
  const file = inputImagem.files[0];
  if (!file) return;
  QrScanner.scanImage(file, { returnDetailedScanResult: true })
    .then(result => setResult(result))
    .catch(e => {
      resultado.textContent = 'Erro ao escanear o código QR: ' + e.message;
      resultado.style.color = 'red';
    });
}      
