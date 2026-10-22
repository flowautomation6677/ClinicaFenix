/**
 * SINDICATO LANDING PAGE - JAVASCRIPT
 * Clínica Fênix & Sindiloto-RJ Parceria Oficial
 */

// Função Global de Submissão do Formulário
window.handleAdesaoSubmit = function(e) {
  if (e && e.preventDefault) {
    e.preventDefault();
  }

  const nomeInput = document.getElementById('adesaoNome');
  const emailInput = document.getElementById('adesaoEmail');
  const whatsappInput = document.getElementById('adesaoWhatsapp');
  const empresaInput = document.getElementById('adesaoEmpresa');
  const perfilSelect = document.getElementById('adesaoPerfil');
  const colaboradoresSelect = document.getElementById('adesaoColaboradores');
  const termosCheck = document.getElementById('adesaoTermos');

  const nome = nomeInput ? nomeInput.value.trim() : '';
  const email = emailInput ? emailInput.value.trim() : '';
  const whatsapp = whatsappInput ? whatsappInput.value.trim() : '';
  const empresa = empresaInput && empresaInput.value.trim() ? empresaInput.value.trim() : 'Lotérica RJ';
  const perfil = perfilSelect ? perfilSelect.value : 'Colaborador';
  const colaboradores = colaboradoresSelect ? colaboradoresSelect.value : '1 colaborador';

  if (!nome || !email || !whatsapp) {
    alert('Por favor, preencha todos os campos obrigatórios (Nome, E-mail e WhatsApp).');
    return false;
  }

  if (termosCheck && !termosCheck.checked) {
    alert('Por favor, concorde com os termos para prosseguir com a adesão.');
    return false;
  }

  // Backup dos dados (com proteção total contra erros de ambiente)
  try {
    if (typeof window !== 'undefined' && 'localStorage' in window) {
      const existingLeads = JSON.parse(window.localStorage.getItem('fenix_sindicato_leads') || '[]');
      existingLeads.push({
        nome,
        email,
        whatsapp,
        empresa,
        perfil,
        colaboradores,
        data: new Date().toISOString()
      });
      window.localStorage.setItem('fenix_sindicato_leads', JSON.stringify(existingLeads));
    }
  } catch (err) {
    console.warn('Aviso: Armazenamento local restrito neste ambiente:', err);
  }

  // Gerar link formatado do WhatsApp Oficial (Clínica Fênix / Sindiloto)
  const zapNumber = '5521969501839';
  const mensagemTexto = encodeURIComponent(
    `👋 Olá, Clínica Fênix! Acabei de solicitar minha adesão pela Parceria SINDILOTO-RJ (R$ 1,00/dia).\n\n` +
    `👤 *Nome:* ${nome}\n` +
    `✉️ *E-mail:* ${email}\n` +
    `📱 *WhatsApp:* ${whatsapp}\n` +
    `🏢 *Lotérica/Empresa:* ${empresa}\n` +
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

  // Limpar formulário
  const form = document.getElementById('formAdesaoSindicato');
  if (form) {
    form.reset();
  }

  return false;
};

// Função Global de Fechamento do Modal
window.closeAdesaoModal = function() {
  const modalSuccess = document.getElementById('modalSuccessAdesao');
  if (modalSuccess) {
    modalSuccess.classList.remove('active');
    modalSuccess.style.cssText = 'display: none !important;';
  }
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

  // 3. Vincular Evento de Submit ao Formulário
  const formAdesao = document.getElementById('formAdesaoSindicato');
  if (formAdesao) {
    formAdesao.addEventListener('submit', window.handleAdesaoSubmit);
  }

  // 4. Fechar Modal em Botão e Overlay
  const btnCloseModal = document.getElementById('btnCloseModal');
  const modalSuccess = document.getElementById('modalSuccessAdesao');

  if (btnCloseModal) {
    btnCloseModal.addEventListener('click', window.closeAdesaoModal);
  }

  if (modalSuccess) {
    modalSuccess.addEventListener('click', function(e) {
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
