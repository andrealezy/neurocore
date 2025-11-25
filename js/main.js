
const navbar = document.getElementById('navbar');
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    menuToggle.classList.toggle('active');
    if (navMenu.classList.contains('active')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  });
}

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('active');
    if (menuToggle) {
      menuToggle.classList.remove('active');
    }
    document.body.style.overflow = '';
  });
});

document.addEventListener('click', (e) => {
  if (window.innerWidth <= 768) {
    if (!navbar.contains(e.target) && navMenu.classList.contains('active')) {
      navMenu.classList.remove('active');
      if (menuToggle) {
        menuToggle.classList.remove('active');
      }
      document.body.style.overflow = '';
    }
  }
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

const canvas = document.getElementById('particleCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const particles = [];
  const particleCount = window.innerWidth < 768 ? 50 : 100;

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 1;
      this.speedX = Math.random() * 2 - 1;
      this.speedY = Math.random() * 2 - 1;
      this.opacity = Math.random() * 0.5 + 0.2;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.x > canvas.width) this.x = 0;
      if (this.x < 0) this.x = canvas.width;
      if (this.y > canvas.height) this.y = 0;
      if (this.y < 0) this.y = canvas.height;
    }

    draw() {
      ctx.fillStyle = `rgba(0, 240, 255, ${this.opacity})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 150) {
          ctx.strokeStyle = `rgba(0, 240, 255, ${0.2 * (1 - distance / 150)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
      particle.update();
      particle.draw();
    });

    connectParticles();
    requestAnimationFrame(animate);
  }

  animate();

  window.addEventListener('resize', () => {
    resizeCanvas();
    const newCount = window.innerWidth < 768 ? 50 : 100;
    if (particles.length !== newCount) {
      particles.length = 0;
      for (let i = 0; i < newCount; i++) {
        particles.push(new Particle());
      }
    }
  });
}

const neuralNetwork = document.getElementById('neuralNetwork');
if (neuralNetwork) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');
  svg.style.position = 'absolute';
  svg.style.top = '0';
  svg.style.left = '0';
  
  const nodes = [];
  const nodeCount = 20;

  for (let i = 0; i < nodeCount; i++) {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    circle.setAttribute('cx', `${x}%`);
    circle.setAttribute('cy', `${y}%`);
    circle.setAttribute('r', '3');
    circle.setAttribute('fill', '#00f0ff');
    circle.style.opacity = '0.6';
    circle.style.filter = 'drop-shadow(0 0 10px #00f0ff)';
    svg.appendChild(circle);
    nodes.push({ element: circle, x, y });
  }

  const lines = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('stroke', '#00f0ff');
      line.setAttribute('stroke-width', '1');
      line.style.opacity = '0.2';
      svg.appendChild(line);
      lines.push({ element: line, node1: nodes[i], node2: nodes[j] });
    }
  }

  neuralNetwork.appendChild(svg);

  function animateNeural() {
    lines.forEach(line => {
      const x1 = (line.node1.x / 100) * window.innerWidth;
      const y1 = (line.node1.y / 100) * window.innerHeight;
      const x2 = (line.node2.x / 100) * window.innerWidth;
      const y2 = (line.node2.y / 100) * window.innerHeight;

      line.element.setAttribute('x1', x1);
      line.element.setAttribute('y1', y1);
      line.element.setAttribute('x2', x2);
      line.element.setAttribute('y2', y2);

      const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
      if (distance < 200) {
        line.element.style.opacity = (200 - distance) / 200 * 0.3;
      } else {
        line.element.style.opacity = '0';
      }
    });

    requestAnimationFrame(animateNeural);
  }

  animateNeural();
}

const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');
const videoModal = document.getElementById('videoModal');
const successModal = document.getElementById('successModal');
const loginBtn = document.getElementById('loginBtn');
const watchVideoBtn = document.getElementById('watchVideoBtn');
const showRegister = document.getElementById('showRegister');
const showLogin = document.getElementById('showLogin');

if (loginBtn) {
  loginBtn.addEventListener('click', () => {
    loginModal.classList.add('active');
    document.documentElement.style.overflowY = 'hidden'
  });
}

if (document.getElementById('closeLoginModal')) {
  document.getElementById('closeLoginModal').addEventListener('click', () => {
    loginModal.classList.remove('active');
    document.documentElement.style.overflowY = '';
  });
}

if (showRegister) {
  showRegister.addEventListener('click', (e) => {
    e.preventDefault();
    loginModal.classList.remove('active');
    registerModal.classList.add('active');
  });
}

if (showLogin) {
  showLogin.addEventListener('click', (e) => {
    e.preventDefault();
    registerModal.classList.remove('active');
    loginModal.classList.add('active');
  });
}

if (document.getElementById('closeRegisterModal')) {
  document.getElementById('closeRegisterModal').addEventListener('click', () => {
    registerModal.classList.remove('active');
  });
}

if (watchVideoBtn) {
  watchVideoBtn.addEventListener('click', () => {
    videoModal.classList.add('active');
  });
}

if (document.getElementById('closeVideoModal')) {
  document.getElementById('closeVideoModal').addEventListener('click', () => {
    videoModal.classList.remove('active');
    const iframe = document.getElementById('demoVideo');
    iframe.src = iframe.src; 
  });
}

[loginModal, registerModal, videoModal, successModal].forEach(modal => {
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  }
});

const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const contactForm = document.getElementById('contactForm');

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    setTimeout(() => {
      loginModal.classList.remove('active');
      alert('Login realizado com sucesso!');
    }, 500);
  });
}

if (registerForm) {
  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    setTimeout(() => {
      registerModal.classList.remove('active');
      successModal.classList.add('active');
    }, 500);
  });
}

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    setTimeout(() => {
      contactForm.reset();
      successModal.classList.add('active');
    }, 500);
  });
}

if (document.getElementById('closeSuccessModal')) {
  document.getElementById('closeSuccessModal').addEventListener('click', () => {
    successModal.classList.remove('active');
  });
}

if (document.getElementById('closeSuccessBtn')) {
  document.getElementById('closeSuccessBtn').addEventListener('click', () => {
    successModal.classList.remove('active');
  });
}

const demoInput = document.getElementById('demoInput');
const demoSubmit = document.getElementById('demoSubmit');
const demoOutput = document.getElementById('demoOutput');
const controlButtons = document.querySelectorAll('.control-btn');

const demoResponses = {
  ideas: [
    "Aqui estão algumas ideias inovadoras:\n\n1. Sistema de IA para otimização de rotas em tempo real\n2. Assistente virtual para educação personalizada\n3. Plataforma de análise preditiva para saúde\n4. Gerador automático de conteúdo criativo\n5. Sistema de recomendação inteligente baseado em comportamento",
    "Ideias geradas com sucesso! A IA analisou padrões de mercado e sugere soluções disruptivas para seu setor."
  ],
  analyze: [
    "Análise do texto realizada:\n\n• Sentimento: Positivo (85%)\n• Tópicos principais: Tecnologia, Inovação, IA\n• Palavras-chave: inteligência artificial, futuro, transformação\n• Complexidade: Média\n• Recomendações: Expandir conceitos técnicos e adicionar exemplos práticos",
    "Análise completa! O texto demonstra conhecimento técnico sólido com potencial para maior profundidade em exemplos práticos."
  ],
  translate: [
    "Tradução realizada:\n\nTexto original: 'The future of AI is here'\nTradução: 'O futuro da IA está aqui'\n\nIdioma detectado: Inglês\nIdioma de destino: Português\nConfiança: 98%",
    "Tradução concluída com alta precisão! A IA manteve o contexto e a nuance do texto original."
  ],
  default: [
    "Processando sua solicitação...\n\nA NeuroCore está analisando sua entrada e gerando uma resposta personalizada baseada em padrões avançados de machine learning.",
    "Resposta gerada com sucesso! A IA processou sua solicitação usando algoritmos de deep learning e retornou uma solução otimizada."
  ]
};

let currentFunction = 'default';

controlButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    currentFunction = btn.dataset.function;
    controlButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

if (demoSubmit) {
  demoSubmit.addEventListener('click', () => {
    const input = demoInput.value.trim();
    if (!input) {
      demoOutput.innerHTML = '<div class="output-placeholder"><i class="fas fa-exclamation-triangle"></i><p>Por favor, digite algo antes de enviar.</p></div>';
      return;
    }

    demoOutput.innerHTML = '<div class="output-placeholder"><i class="fas fa-spinner fa-spin"></i><p>Processando com IA...</p></div>';

    setTimeout(() => {
      const responses = demoResponses[currentFunction] || demoResponses.default;
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      demoOutput.innerHTML = `
        <div class="chat-message ai">
          <p style="white-space: pre-line;">${randomResponse}</p>
        </div>
      `;
      
      demoOutput.style.animation = 'fadeIn 0.5s ease';
    }, 1500);
  });
}

const testimonialTrack = document.getElementById('testimonialTrack');
const prevBtn = document.getElementById('prevTestimonial');
const nextBtn = document.getElementById('nextTestimonial');
const dots = document.querySelectorAll('.dot');
let currentSlide = 0;

const slides = document.querySelectorAll('.testimonial-slide');
const totalSlides = slides.length;

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.remove('active');
    if (i === index) {
      slide.classList.add('active');
    }
  });

  dots.forEach((dot, i) => {
    dot.classList.remove('active');
    if (i === index) {
      dot.classList.add('active');
    }
  });
}

if (nextBtn) {
  nextBtn.addEventListener('click', () => {
    currentSlide = (currentSlide + 1) % totalSlides;
    showSlide(currentSlide);
  });
}

if (prevBtn) {
  prevBtn.addEventListener('click', () => {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    showSlide(currentSlide);
  });
}

dots.forEach((dot, index) => {
  dot.addEventListener('click', () => {
    currentSlide = index;
    showSlide(currentSlide);
  });
});

setInterval(() => {
  currentSlide = (currentSlide + 1) % totalSlides;
  showSlide(currentSlide);
}, 5000);

const chatButton = document.getElementById('chatButton');
const chatWidget = document.getElementById('chatWidget');
const chatClose = document.getElementById('chatClose');
const chatSend = document.getElementById('chatSend');
const chatInput = document.getElementById('chatInput');
const chatMessages = document.getElementById('chatMessages');

const chatResponses = [
  "Olá! Como posso ajudar você hoje?",
  "A NeuroCore oferece soluções avançadas de IA. Posso explicar mais sobre nossos produtos!",
  "Nossos sistemas de IA são capazes de processar informações em tempo real e gerar insights valiosos.",
  "Interessado em saber mais? Entre em contato conosco através do formulário ou agende uma demonstração!",
  "Nossa tecnologia utiliza deep learning e processamento neural avançado para resultados excepcionais."
];

if (chatButton) {
  chatButton.addEventListener('click', () => {
    chatWidget.classList.toggle('active');
  });
}

if (chatClose) {
  chatClose.addEventListener('click', () => {
    chatWidget.classList.remove('active');
  });
}

function addChatMessage(message, isAI = true) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `chat-message ${isAI ? 'ai' : 'user'}`;
  messageDiv.innerHTML = `<p>${message}</p>`;
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

if (chatSend && chatInput) {
  chatSend.addEventListener('click', () => {
    const message = chatInput.value.trim();
    if (message) {
      addChatMessage(message, false);
      chatInput.value = '';

      setTimeout(() => {
        const response = chatResponses[Math.floor(Math.random() * chatResponses.length)];
        addChatMessage(response, true);
      }, 1000);
    }
  });

  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      chatSend.click();
    }
  });
}

const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animation = 'fadeInUp 0.8s ease-out';
      entry.target.style.opacity = '1';
    }
  });
}, observerOptions);

document.querySelectorAll('section, .floating-card, .product-card, .info-card').forEach(el => {
  el.style.opacity = '0';
  observer.observe(el);
});

const ctaBtn = document.getElementById('ctaBtn');
if (ctaBtn) {
  ctaBtn.addEventListener('click', () => {
    document.getElementById('demo').scrollIntoView({ behavior: 'smooth' });
  });
}

function playSound(frequency = 440, duration = 200) {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration / 1000);
  } catch (e) {
  }
}


document.querySelectorAll('button, .nav-link').forEach(btn => {
  btn.addEventListener('click', () => {
  });
});

document.querySelectorAll('.product-card, .floating-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
  });
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    [loginModal, registerModal, videoModal, successModal, chatWidget].forEach(modal => {
      if (modal && modal.classList.contains('active')) {
        modal.classList.remove('active');
      }
    });
  }
});

async function loadSplineScene() {
  const splineContainer = document.getElementById('spline-container');
  if (!splineContainer) return;

  try {
    const { Application } = await import('https://unpkg.com/@splinetool/runtime@1.0.0/build/runtime.js');
    
    const canvas = document.createElement('canvas');
    canvas.id = 'spline-canvas';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    
    splineContainer.innerHTML = '';
    splineContainer.appendChild(canvas);
    
    const app = new Application(canvas);
    
    await app.load('https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode');
    
    console.log('Spline scene loaded successfully');
  } catch (error) {
    console.error('Error loading Spline scene:', error);
    splineContainer.innerHTML = `
      <div class="spline-loader">
        <div class="loader-spinner"></div>
        <span>Erro ao carregar cena 3D. Por favor, recarregue a página.</span>
      </div>
    `;
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadSplineScene);
} else {
  loadSplineScene();
}

console.log('%cNeuroCore AI Platform', 'font-size: 24px; font-weight: bold; color: #00f0ff; text-shadow: 0 0 10px #00f0ff;');
console.log('%cBem-vindo ao futuro da Inteligência Artificial!', 'font-size: 14px; color: #b400ff;');



const ano = document.getElementById('ano');
const anoAtual = new Date();
ano.textContent = anoAtual.getFullYear();