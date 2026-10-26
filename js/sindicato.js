/**
 * SINDICATO LANDING PAGE - JAVASCRIPT
 * Clínica Fênix & Sindiloto-RJ Parceria Oficial
 */

// URL DO GOOGLE APPS SCRIPT (PLANILHA GOOGLE SHEETS)
// Basta colar a URL gerada no Google Apps Script entre as aspas abaixo:
window.CLINICA_FENIX_GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbyUhck_2y1B4qU2WXIJcg6_VyEZyO6zS5pASn62jXenCGqJfxz4PIZdTGMqiV1olKgC/exec';

let isSubmittingAdesao = false;

// Função Global de Submissão do Formulário
window.handleAdesaoSubmit = function (e) {
  if (e) {
    if (e.preventDefault) e.preventDefault();
    if (e.stopPropagation) e.stopPropagation();
  }

  // Prevenir qualquer execução duplicada ou duplo clique
  if (isSubmittingAdesao) {
    return false;
  }

  const nomeInput = document.getElementById('adesaoNome');
  const emailInput = document.getElementById('adesaoEmail');
  const whatsappInput = document.getElementById('adesaoWhatsapp');
  const empresaInput = document.getElementById('adesaoEmpresa') || document.getElementById('adesaoCidade');
  const perfilSelect = document.getElementById('adesaoPerfil');
  const colaboradoresSelect = document.getElementById('adesaoColaboradores');
  const termosCheck = document.getElementById('adesaoTermos');

  const nome = nomeInput ? nomeInput.value.trim() : '';
  const email = emailInput ? emailInput.value.trim() : '';
  const whatsapp = whatsappInput ? whatsappInput.value.trim() : '';
  const empresaCidade = empresaInput && empresaInput.value.trim() ? empresaInput.value.trim() : 'Não informada';
  const perfil = perfilSelect ? perfilSelect.value : 'Colaborador';
  const colaboradores = colaboradoresSelect ? colaboradoresSelect.value : '1 colaborador';

  // Validação silenciosa e segura (o HTML5 já possui atributos 'required')
  if (!nome || !email || !whatsapp) {
    if (nomeInput && !nome) nomeInput.focus();
    else if (emailInput && !email) emailInput.focus();
    else if (whatsappInput && !whatsapp) whatsappInput.focus();
    return false;
  }

  if (termosCheck && !termosCheck.checked) {
    termosCheck.focus();
    return false;
  }

  // Ativar trava de envio imediatamente
  isSubmittingAdesao = true;

  // Feedback visual no botão de envio
  const form = document.getElementById('formAdesaoSindicato');
  const btnSubmit = form ? form.querySelector('button[type="submit"]') : null;
  const originalBtnHtml = btnSubmit ? btnSubmit.innerHTML : '';
  if (btnSubmit) {
    btnSubmit.disabled = true;
    btnSubmit.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processando...';
  }

  // Backup dos dados no navegador (localStorage)
  try {
    if (typeof window !== 'undefined' && 'localStorage' in window) {
      const existingLeads = JSON.parse(window.localStorage.getItem('fenix_sindicato_leads') || '[]');
      existingLeads.push({
        nome,
        email,
        whatsapp,
        empresa: empresaCidade,
        cidade: empresaCidade,
        perfil,
        colaboradores,
        data: new Date().toISOString()
      });
      window.localStorage.setItem('fenix_sindicato_leads', JSON.stringify(existingLeads));
    }
  } catch (err) {
    console.warn('Aviso: Armazenamento local restrito neste ambiente:', err);
  }

  // Envio Automático para a Planilha do Google Sheets da Clínica Fênix
  let sheetsUrl = (window.CLINICA_FENIX_GOOGLE_SHEETS_URL || '').trim();
  if (sheetsUrl) {
    if (!sheetsUrl.startsWith('http')) {
      sheetsUrl = `https://script.google.com/macros/s/${sheetsUrl}/exec`;
    }
    try {
      fetch(sheetsUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify({
          dataHora: new Date().toLocaleString('pt-BR'),
          nome: nome,
          email: email,
          whatsapp: whatsapp,
          empresaCidade: empresaCidade,
          perfil: perfil,
          colaboradores: colaboradores
        })
      }).catch(function (err) {
        console.warn('Aviso ao sincronizar com Google Sheets:', err);
      });
    } catch (err) {
      console.warn('Falha na requisição Google Sheets:', err);
    }
  }

  // Gerar link formatado do WhatsApp Oficial (Clínica Fênix / Sindiloto: 21 2761-8550)
  const zapNumber = '552127618550';
  const mensagemTexto = encodeURIComponent(
    `👋 Olá, Clínica Fênix! Acabei de solicitar minha adesão pela Parceria SINDILOTO-RJ (R$ 1,00/dia).\n\n` +
    `👤 *Nome:* ${nome}\n` +
    `✉️ *E-mail:* ${email}\n` +
    `📱 *WhatsApp:* ${whatsapp}\n` +
    `🏢 *Lotérica/Cidade:* ${empresaCidade}\n` +
    `💼 *Perfil:* ${perfil}\n` +
    `👥 *Colaboradores:* ${colaboradores}\n\n` +
    `Gostaria de concluir a adesão e receber mais detalhes!`
  );

  const zapUrl = `https://wa.me/${zapNumber}?text=${mensagemTexto}`;

  const modalWhatsappLink = document.getElementById('modalWhatsappLink');
  const modalUserName = document.getElementById('modalUserName');
  const modalSuccess = document.getElementById('modalSuccessAdesao');

  if (modalWhatsappLink) {
    modalWhatsappLink.href = zapUrl;
  }
  if (modalUserName) {
    const firstName = nome.split(' ')[0] || nome;
    modalUserName.textContent = firstName;
  }

  // Exibir o Modal de Confirmação com máxima prioridade visual
  if (modalSuccess) {
    modalSuccess.classList.add('active');
    modalSuccess.style.cssText = 'display: flex !important; z-index: 999999; opacity: 1; pointer-events: auto;';
  }

  // Limpar formulário de forma segura
  if (form) {
    form.reset();
  }

  // Restaurar o botão e a trava após 3 segundos
  setTimeout(function () {
    if (btnSubmit) {
      btnSubmit.disabled = false;
      btnSubmit.innerHTML = originalBtnHtml || '<i class="fas fa-check-circle"></i> Quero Minha Adesão Agora';
    }
    isSubmittingAdesao = false;
  }, 3000);

  return false;
};

// Função Global de Fechamento do Modal
window.closeAdesaoModal = function () {
  const modalSuccess = document.getElementById('modalSuccessAdesao');
  if (modalSuccess) {
    modalSuccess.classList.remove('active');
    modalSuccess.style.cssText = 'display: none !important;';
  }

  const form = document.getElementById('formAdesaoSindicato');
  const btnSubmit = form ? form.querySelector('button[type="submit"]') : null;
  if (btnSubmit && btnSubmit.disabled) {
    btnSubmit.disabled = false;
    btnSubmit.innerHTML = '<i class="fas fa-check-circle"></i> Quero Minha Adesão Agora';
  }
  isSubmittingAdesao = false;
};

function initSindicatoPage() {
  // 1. Inicializar AOS se presente
  if (typeof AOS !== 'undefined') {
    try {
      AOS.init({
        duration: 700,
        easing: 'ease-out-cubic',
        once: true,
        offset: 40
      });
    } catch (e) {
      console.warn('AOS init:', e);
    }
  }

  // 2. Máscara de Telefone / WhatsApp Automática
  const whatsappInput = document.getElementById('adesaoWhatsapp');
  if (whatsappInput) {
    whatsappInput.addEventListener('input', function (e) {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length > 11) value = value.slice(0, 11);

      if (value.length > 10) {
        // (XX) XXXXX-XXXX
        value = value.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
      } else if (value.length > 6) {
        // (XX) XXXX-XXXX
        value = value.replace(/^(\d{2})(\d{4})(\d{0,4})$/, '($1) $2-$3');
      } else if (value.length > 2) {
        value = value.replace(/^(\d{2})(\d{0,5})$/, '($1) $2');
      } else if (value.length > 0) {
        value = value.replace(/^(\d{0,2})$/, '($1');
      }
      e.target.value = value;
    });
  }

  // 3. Vincular Evento de Submit ao Formulário (garantir vínculo único e sem conflitos)
  const formAdesao = document.getElementById('formAdesaoSindicato');
  if (formAdesao) {
    formAdesao.onsubmit = window.handleAdesaoSubmit;
  }

  // 4. Fechar Modal em Botão e Overlay
  const btnCloseModal = document.getElementById('btnCloseModal');
  const modalSuccess = document.getElementById('modalSuccessAdesao');

  if (btnCloseModal) {
    btnCloseModal.addEventListener('click', window.closeAdesaoModal);
  }

  if (modalSuccess) {
    modalSuccess.addEventListener('click', function (e) {
      if (e.target === modalSuccess) {
        window.closeAdesaoModal();
      }
    });
  }

  // 5. FAQ Accordion
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(function (button) {
    button.addEventListener('click', function () {
      const item = this.parentElement;
      const isActive = item.classList.contains('active');

      document.querySelectorAll('.faq-item').forEach(function (el) {
        el.classList.remove('active');
      });

      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // 6. Rolagem Suave para Âncoras
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });
}

// Execução segura: roda imediatamente ou no DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSindicatoPage);
} else {
  initSindicatoPage();
}
