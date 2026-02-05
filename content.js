class AutoFormFiller {
  constructor() {
    this.isRunning = false;
    this.isPaused = false;
    this.speed = 1000;
    this.currentFieldIndex = 0;
    this.processedFields = new Set();
    this.timeoutId = null;
    
    // Base de dados de personagens de animação
    this.animationCharacters = [
      'Mickey Mouse', 'Minnie Mouse', 'Donald Duck', 'Goofy', 'Pluto',
      'Bugs Bunny', 'Daffy Duck', 'Porky Pig', 'Tweety', 'Sylvester',
      'Tom', 'Jerry', 'Scooby Doo', 'Shaggy Rogers', 'Fred Flintstone',
      'Barney Rubble', 'Homer Simpson', 'Bart Simpson', 'Lisa Simpson',
      'Marge Simpson', 'SpongeBob SquarePants', 'Patrick Star', 'Squidward',
      'Sandy Cheeks', 'Mr. Krabs', 'Ash Ketchum', 'Pikachu', 'Naruto Uzumaki',
      'Sasuke Uchiha', 'Sakura Haruno', 'Goku', 'Vegeta', 'Gohan',
      'Piccolo', 'Frieza', 'Luffy', 'Zoro', 'Nami', 'Sanji', 'Chopper',
      'Robin', 'Franky', 'Brook', 'Edward Elric', 'Alphonse Elric',
      'Roy Mustang', 'Winry Rockbell', 'Ichigo Kurosaki', 'Rukia Kuchiki',
      'Uryu Ishida', 'Orihime Inoue', 'Light Yagami', 'L Lawliet',
      'Misa Amane', 'Ryuk', 'Sailor Moon', 'Tuxedo Mask', 'Sailor Mars',
      'Sailor Mercury', 'Sailor Jupiter', 'Sailor Venus', 'Woody',
      'Buzz Lightyear', 'Mr. Potato Head', 'Rex', 'Hamm', 'Slinky Dog',
      'Bo Peep', 'Andy Davis', 'Molly Davis', 'Sid Phillips', 'Hannah Phillips'
    ];
    
    this.init();
  }
  
  init() {
    // Carregar estado salvo
    chrome.storage.local.get(['formFillerStatus', 'formFillerSpeed'], (result) => {
      if (result.formFillerStatus === 'active') {
        this.isRunning = true;
        this.isPaused = false;
      } else if (result.formFillerStatus === 'paused') {
        this.isRunning = true;
        this.isPaused = true;
      }
      
      if (result.formFillerSpeed) {
        this.speed = result.formFillerSpeed;
      }
    });
  }
  
  getRandomCharacter() {
    return this.animationCharacters[Math.floor(Math.random() * this.animationCharacters.length)];
  }
  
  generateEmail(name) {
    const cleanName = name.toLowerCase().replace(/\s+/g, '.');
    const randomNum = Math.floor(Math.random() * 999) + 1;
    return `${cleanName}${randomNum}@swordhealth.com`;
  }
  
  generatePhoneNumber() {
    return `+351 9${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 10000000).toString().padStart(7, '0')}`;
  }
  
  generateDate() {
    const year = Math.floor(Math.random() * 30) + 1990;
    const month = Math.floor(Math.random() * 12) + 1;
    const day = Math.floor(Math.random() * 28) + 1;
    return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
  }
  
  generateAddress() {
    const streets = ['Rua da Liberdade', 'Av. da República', 'Rua Augusta', 'Rua do Carmo', 'Av. Almirante Reis'];
    const street = streets[Math.floor(Math.random() * streets.length)];
    const number = Math.floor(Math.random() * 999) + 1;
    return `${street}, ${number}`;
  }
  
  generateCity() {
    const cities = ['Lisboa', 'Porto', 'Braga', 'Coimbra', 'Faro', 'Aveiro', 'Viseu', 'Évora'];
    return cities[Math.floor(Math.random() * cities.length)];
  }
  
  generatePostalCode() {
    return `${Math.floor(Math.random() * 9999) + 1000}-${Math.floor(Math.random() * 999).toString().padStart(3, '0')}`;
  }
  
  detectFieldType(element) {
    const id = element.id?.toLowerCase() || '';
    const name = element.name?.toLowerCase() || '';
    const placeholder = element.placeholder?.toLowerCase() || '';
    const label = this.getFieldLabel(element)?.toLowerCase() || '';
    const type = element.type?.toLowerCase() || '';
    
    const allText = `${id} ${name} ${placeholder} ${label}`.toLowerCase();
    
    // Email
    if (type === 'email' || allText.includes('email') || allText.includes('e-mail')) {
      return 'email';
    }
    
    // Nome
    if (allText.includes('name') || allText.includes('nome') || 
        allText.includes('first') || allText.includes('last') || 
        allText.includes('primeiro') || allText.includes('último') ||
        allText.includes('apelido') || allText.includes('surname')) {
      return 'name';
    }
    
    // Telefone
    if (type === 'tel' || allText.includes('phone') || allText.includes('tel') || 
        allText.includes('telefone') || allText.includes('móvel') || allText.includes('celular')) {
      return 'phone';
    }
    
    // Data
    if (type === 'date' || allText.includes('date') || allText.includes('birth') || 
        allText.includes('data') || allText.includes('nascimento') || allText.includes('aniversário')) {
      return 'date';
    }
    
    // Endereço
    if (allText.includes('address') || allText.includes('endereço') || 
        allText.includes('morada') || allText.includes('rua') || allText.includes('street')) {
      return 'address';
    }
    
    // Cidade
    if (allText.includes('city') || allText.includes('cidade')) {
      return 'city';
    }
    
    // Código postal
    if (allText.includes('postal') || allText.includes('zip') || allText.includes('código')) {
      return 'postal';
    }
    
    // País
    if (allText.includes('country') || allText.includes('país')) {
      return 'country';
    }
    
    return 'text';
  }
  
  getFieldLabel(element) {
    // Procurar label associada
    if (element.id) {
      const label = document.querySelector(`label[for="${element.id}"]`);
      if (label) return label.textContent;
    }
    
    // Procurar label pai
    const parentLabel = element.closest('label');
    if (parentLabel) return parentLabel.textContent;
    
    // Procurar label anterior
    const previousElement = element.previousElementSibling;
    if (previousElement && previousElement.tagName === 'LABEL') {
      return previousElement.textContent;
    }
    
    return '';
  }
  
  getValueForField(fieldType, element) {
    const character = this.getRandomCharacter();
    
    switch (fieldType) {
      case 'email':
        return this.generateEmail(character);
      case 'name':
        return character;
      case 'phone':
        return this.generatePhoneNumber();
      case 'date':
        if (element.type === 'date') {
          const year = Math.floor(Math.random() * 30) + 1990;
          const month = Math.floor(Math.random() * 12) + 1;
          const day = Math.floor(Math.random() * 28) + 1;
          return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        }
        return this.generateDate();
      case 'address':
        return this.generateAddress();
      case 'city':
        return this.generateCity();
      case 'postal':
        return this.generatePostalCode();
      case 'country':
        return 'Portugal';
      default:
        return character;
    }
  }
  
  getFormFields() {
    const selectors = [
      'input[type="text"]:not([readonly]):not([disabled])',
      'input[type="email"]:not([readonly]):not([disabled])',
      'input[type="tel"]:not([readonly]):not([disabled])',
      'input[type="date"]:not([readonly]):not([disabled])',
      'input[type="number"]:not([readonly]):not([disabled])',
      'input:not([type]):not([readonly]):not([disabled])',
      'textarea:not([readonly]):not([disabled])',
      'select:not([disabled])'
    ];
    
    const fields = Array.from(document.querySelectorAll(selectors.join(', ')))
      .filter(field => {
        const style = window.getComputedStyle(field);
        return style.display !== 'none' && 
               style.visibility !== 'hidden' && 
               field.offsetWidth > 0 && 
               field.offsetHeight > 0;
      });
    
    return fields;
  }
  
  async fillField(field) {
    return new Promise((resolve) => {
      // Verificar se o campo já foi processado
      const fieldKey = this.getFieldKey(field);
      if (this.processedFields.has(fieldKey)) {
        resolve();
        return;
      }
      
      // Focar no campo
      field.focus();
      field.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // Destacar o campo
      const originalStyle = field.style.border;
      field.style.border = '3px solid #4CAF50';
      field.style.transition = 'border 0.3s ease';
      
      setTimeout(() => {
        const fieldType = this.detectFieldType(field);
        
        if (field.tagName === 'SELECT') {
          // Preencher select
          const options = Array.from(field.options).filter(opt => opt.value && opt.value !== '');
          if (options.length > 0) {
            const randomOption = options[Math.floor(Math.random() * options.length)];
            field.value = randomOption.value;
          }
        } else {
          // Preencher input/textarea
          const value = this.getValueForField(fieldType, field);
          field.value = value;
        }
        
        // Disparar eventos
        field.dispatchEvent(new Event('input', { bubbles: true }));
        field.dispatchEvent(new Event('change', { bubbles: true }));
        field.dispatchEvent(new Event('blur', { bubbles: true }));
        
        // Marcar como processado
        this.processedFields.add(fieldKey);
        
        // Remover destaque
        setTimeout(() => {
          field.style.border = originalStyle;
          resolve();
        }, 300);
      }, 200);
    });
  }
  
  getFieldKey(field) {
    return field.id || field.name || field.className || field.outerHTML.substring(0, 50);
  }
  
  findNextButton() {
    const selectors = [
      'button[type="submit"]',
      'input[type="submit"]',
      'button:contains("Next")',
      'button:contains("Continue")',
      'button:contains("Próximo")',
      'button:contains("Continuar")',
      'button:contains("Seguinte")',
      'a[href*="next"]',
      '.btn-next',
      '.next-button',
      '.continue-btn'
    ];
    
    for (let selector of selectors) {
      const button = document.querySelector(selector);
      if (button && button.offsetParent !== null) {
        return button;
      }
    }
    
    // Procurar por texto em botões
    const buttons = Array.from(document.querySelectorAll('button, input[type="button"], input[type="submit"]'));
    const nextButton = buttons.find(btn => {
      const text = btn.textContent?.toLowerCase() || btn.value?.toLowerCase() || '';
      return text.includes('next') || text.includes('continue') || 
             text.includes('próximo') || text.includes('continuar') || 
             text.includes('seguinte') || text.includes('enviar') ||
             text.includes('submit');
    });
    
    return nextButton;
  }
  
  async processForm() {
    if (!this.isRunning || this.isPaused) return;
    
    const fields = this.getFormFields();
    
    // Filtrar campos ainda não processados
    const unprocessedFields = fields.filter(field => {
      const fieldKey = this.getFieldKey(field);
      return !this.processedFields.has(fieldKey);
    });
    
    if (unprocessedFields.length === 0) {
      // Todos os campos foram preenchidos, procurar botão próximo
      const nextButton = this.findNextButton();
      if (nextButton) {
        setTimeout(() => {
          nextButton.click();
          // Limpar campos processados para a próxima página
          this.processedFields.clear();
          this.currentFieldIndex = 0;
          
          // Continuar após um breve delay para carregamento da página
          setTimeout(() => {
            if (this.isRunning && !this.isPaused) {
              this.processForm();
            }
          }, 2000);
        }, 1000);
      } else {
        // Não há mais campos nem botão próximo, parar
        this.stop();
      }
      return;
    }
    
    // Processar próximo campo
    if (this.currentFieldIndex < unprocessedFields.length) {
      const currentField = unprocessedFields[this.currentFieldIndex];
      await this.fillField(currentField);
      this.currentFieldIndex++;
      
      // Continuar para o próximo campo
      this.timeoutId = setTimeout(() => {
        this.processForm();
      }, this.speed);
    }
  }
  
  start() {
    this.isRunning = true;
    this.isPaused = false;
    chrome.storage.local.set({formFillerStatus: 'active'});
    console.log('Form filler iniciado');
    this.processForm();
  }
  
  pause() {
    this.isPaused = true;
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    chrome.storage.local.set({formFillerStatus: 'paused'});
    console.log('Form filler pausado');
  }
  
  stop() {
    this.isRunning = false;
    this.isPaused = false;
    this.currentFieldIndex = 0;
    this.processedFields.clear();
    
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    
    chrome.storage.local.set({formFillerStatus: 'stopped'});
    console.log('Form filler parado');
  }
  
  updateSpeed(newSpeed) {
    this.speed = newSpeed;
    chrome.storage.local.set({formFillerSpeed: newSpeed});
    console.log('Velocidade atualizada:', newSpeed);
  }
}

// Instanciar o form filler
const formFiller = new AutoFormFiller();

// Listener para mensagens da popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.action) {
    case 'start':
      formFiller.updateSpeed(request.speed);
      formFiller.start();
      break;
    case 'pause':
      formFiller.pause();
      break;
    case 'stop':
      formFiller.stop();
      break;
    case 'updateSpeed':
      formFiller.updateSpeed(request.speed);
      break;
  }
  sendResponse({status: 'success'});
});
