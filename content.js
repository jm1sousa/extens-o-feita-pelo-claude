class AutoFormFiller {
  constructor() {
    this.isRunning = false;
    this.isPaused = false;
    this.speed = 1000;
    this.currentFieldIndex = 0;
    this.processedFields = new Set();
    this.timeoutId = null;
    
    // Base de dados de personagens
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
      'Woody', 'Buzz Lightyear', 'Simba', 'Mufasa', 'Elsa', 'Anna',
      'Olaf', 'Moana', 'Maui', 'Belle', 'Beast', 'Aladdin', 'Jasmine',
      'Ariel', 'Sebastian', 'Flounder', 'Nemo', 'Dory', 'Marlin',
      'Shrek', 'Fiona', 'Donkey', 'Puss in Boots', 'Po', 'Tigress'
    ];
    
    this.init();
  }
  
  init() {
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
    const cleanName = name.toLowerCase()
      .replace(/\s+/g, '.')
      .replace(/[^a-z0-9.]/g, '');
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
  
  generateDateISO() {
    const year = Math.floor(Math.random() * 30) + 1990;
    const month = Math.floor(Math.random() * 12) + 1;
    const day = Math.floor(Math.random() * 28) + 1;
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  }
  
  generateTime() {
    const hours = Math.floor(Math.random() * 24);
    const minutes = Math.floor(Math.random() * 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }
  
  generateNumber(min = 1, max = 100) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  generateAge() {
    return Math.floor(Math.random() * 60) + 18;
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
    const id = (element.id || '').toLowerCase();
    const name = (element.name || '').toLowerCase();
    const placeholder = (element.placeholder || '').toLowerCase();
    const type = (element.type || 'text').toLowerCase();
    const className = (element.className || '').toLowerCase();
    
    const allText = `${id} ${name} ${placeholder} ${className}`.toLowerCase();
    
    // Tipos específicos primeiro
    if (type === 'email' || allText.includes('email') || allText.includes('e-mail')) {
      return 'email';
    }
    
    if (type === 'tel' || allText.includes('phone') || allText.includes('tel') || allText.includes('telefone')) {
      return 'phone';
    }
    
    if (type === 'date' || allText.includes('date') || allText.includes('birth') || allText.includes('data')) {
      return 'date';
    }
    
    if (type === 'time') {
      return 'time';
    }
    
    if (type === 'number' || allText.includes('age') || allText.includes('idade')) {
      return 'number';
    }
    
    if (allText.includes('name') || allText.includes('nome') || allText.includes('first') || allText.includes('last')) {
      return 'name';
    }
    
    if (allText.includes('address') || allText.includes('endereço') || allText.includes('street') || allText.includes('rua')) {
      return 'address';
    }
    
    if (allText.includes('city') || allText.includes('cidade')) {
      return 'city';
    }
    
    if (allText.includes('postal') || allText.includes('zip') || allText.includes('código')) {
      return 'postal';
    }
    
    if (allText.includes('country') || allText.includes('país')) {
      return 'country';
    }
    
    return 'text';
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
        return element.type === 'date' ? this.generateDateISO() : this.generateDate();
      case 'time':
        return this.generateTime();
      case 'number':
        if (element.getAttribute('max')) {
          const max = parseInt(element.getAttribute('max'));
          const min = parseInt(element.getAttribute('min')) || 1;
          return this.generateNumber(min, max);
        }
        return this.generateAge();
      case 'address':
        return this.generateAddress();
      case 'city':
        return this.generateCity();
      case 'postal':
        return this.generatePostalCode();
      case 'country':
        return 'Portugal';
      default:
        if (element.tagName === 'TEXTAREA') {
          return `Olá! Sou ${character} e estou muito interessado/a nesta oportunidade.`;
        }
        return character;
    }
  }
  
  getFormFields() {
    // Buscar TODOS os campos de forma mais simples
    const allInputs = document.querySelectorAll('input, textarea, select');
    
    console.log('Total de elementos encontrados:', allInputs.length);
    
    const validFields = Array.from(allInputs).filter(field => {
      // Excluir tipos que não devemos preencher
      const excludedTypes = ['submit', 'button', 'reset', 'file', 'image', 'hidden', 'checkbox', 'radio'];
      
      // Verificar se não é um tipo excluído
      if (excludedTypes.includes(field.type)) {
        return false;
      }
      
      // Verificar se não está readonly ou disabled
      if (field.readOnly || field.disabled) {
        return false;
      }
      
      // Verificar se está visível
      const rect = field.getBoundingClientRect();
      const style = window.getComputedStyle(field);
      
      const isVisible = rect.width > 0 && 
                       rect.height > 0 && 
                       style.display !== 'none' && 
                       style.visibility !== 'hidden' &&
                       style.opacity !== '0';
      
      return isVisible;
    });
    
    console.log('Campos válidos encontrados:', validFields.length);
    validFields.forEach((field, index) => {
      console.log(`Campo ${index + 1}:`, {
        tag: field.tagName,
        type: field.type,
        id: field.id,
        name: field.name,
        placeholder: field.placeholder
      });
    });
    
    return validFields;
  }
  
  async fillField(field) {
    return new Promise((resolve) => {
      const fieldKey = this.getFieldKey(field);
      if (this.processedFields.has(fieldKey)) {
        console.log('Campo já processado, pulando...');
        resolve();
        return;
      }
      
      console.log('Iniciando preenchimento do campo:', field);
      
      // Scroll para o campo e focar
      field.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // Destacar o campo
      const originalBorder = field.style.border;
      const originalBoxShadow = field.style.boxShadow;
      
      field.style.border = '3px solid #4CAF50';
      field.style.boxShadow = '0 0 10px rgba(76, 175, 80, 0.5)';
      
      setTimeout(() => {
        try {
          field.focus();
          
          const fieldType = this.detectFieldType(field);
          console.log('Tipo de campo detectado:', fieldType);
          
          let value;
          
          if (field.tagName === 'SELECT') {
            // Preencher select
            const options = Array.from(field.options).filter(opt => 
              opt.value && opt.value !== '' && !opt.disabled
            );
            
            if (options.length > 1) { // Pular primeira opção se for placeholder
              const randomOption = options[Math.floor(Math.random() * options.length)];
              field.value = randomOption.value;
              value = randomOption.value;
            }
          } else {
            // Preencher input ou textarea
            value = this.getValueForField(fieldType, field);
            field.value = value;
          }
          
          console.log('Valor inserido:', value);
          
          // Disparar eventos
          const events = ['input', 'change', 'blur'];
          events.forEach(eventName => {
            const event = new Event(eventName, { bubbles: true });
            field.dispatchEvent(event);
          });
          
          // Marcar como processado
          this.processedFields.add(fieldKey);
          
          // Restaurar estilos
          setTimeout(() => {
            field.style.border = originalBorder;
            field.style.boxShadow = originalBoxShadow;
            resolve();
          }, 300);
          
        } catch (error) {
          console.error('Erro ao preencher campo:', error);
          field.style.border = originalBorder;
          field.style.boxShadow = originalBoxShadow;
          resolve();
        }
      }, 500);
    });
  }
  
  getFieldKey(field) {
    return field.id || field.name || field.className || field.type || Math.random().toString();
  }
  
  findNextButton() {
    const buttons = document.querySelectorAll('button, input[type="submit"], input[type="button"], a');
    
    for (let button of buttons) {
      const text = (button.textContent || button.value || '').toLowerCase();
      const rect = button.getBoundingClientRect();
      
      // Verificar se está visível
      if (rect.width === 0 || rect.height === 0) continue;
      
      // Procurar palavras-chave
      const keywords = ['next', 'continue', 'submit', 'send', 'próximo', 'continuar', 'enviar'];
      if (keywords.some(keyword => text.includes(keyword))) {
        return button;
      }
    }
    
    // Se não encontrar, retornar o último botão submit
    const submitButtons = document.querySelectorAll('button[type="submit"], input[type="submit"]');
    return submitButtons[submitButtons.length - 1];
  }
  
  async processForm() {
    if (!this.isRunning || this.isPaused) {
      console.log('Processo parado. Running:', this.isRunning, 'Paused:', this.isPaused);
      return;
    }
    
    console.log('=== INICIANDO PROCESSAMENTO DO FORMULÁRIO ===');
    
    const fields = this.getFormFields();
    
    if (fields.length === 0) {
      console.log('Nenhum campo encontrado na página');
      this.stop();
      return;
    }
    
    const unprocessedFields = fields.filter(field => {
      const fieldKey = this.getFieldKey(field);
      return !this.processedFields.has(fieldKey);
    });
    
    console.log(`Campos não processados: ${unprocessedFields.length} de ${fields.length}`);
    
    if (unprocessedFields.length === 0) {
      console.log('Todos os campos foram preenchidos. Procurando botão próximo...');
      
      const nextButton = this.findNextButton();
      if (nextButton) {
        console.log('Botão próximo encontrado:', nextButton);
        
        setTimeout(() => {
          nextButton.click();
          console.log('Botão clicado. Aguardando nova página...');
          
          // Resetar para próxima página
          this.processedFields.clear();
          this.currentFieldIndex = 0;
          
          // Aguardar carregamento da página
          setTimeout(() => {
            if (this.isRunning && !this.isPaused) {
              console.log('Continuando na nova página...');
              this.processForm();
            }
          }, 3000);
        }, 1000);
      } else {
        console.log('Nenhum botão próximo encontrado. Finalizando...');
        this.stop();
      }
      return;
    }
    
    // Processar próximo campo
    if (this.currentFieldIndex < unprocessedFields.length) {
      const currentField = unprocessedFields[this.currentFieldIndex];
      console.log(`Processando campo ${this.currentFieldIndex + 1}/${unprocessedFields.length}`);
      
      await this.fillField(currentField);
      this.currentFieldIndex++;
      
      // Continuar com próximo campo
      this.timeoutId = setTimeout(() => {
        this.processForm();
      }, this.speed);
    }
  }
  
  start() {
    console.log('=== INICIANDO FORM FILLER ===');
    this.isRunning = true;
    this.isPaused = false;
    this.currentFieldIndex = 0;
    chrome.storage.local.set({formFillerStatus: 'active'});
    this.processForm();
  }
  
  pause() {
    console.log('Form filler pausado');
    this.isPaused = true;
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    chrome.storage.local.set({formFillerStatus: 'paused'});
  }
  
  stop() {
    console.log('Form filler parado');
    this.isRunning = false;
    this.isPaused = false;
    this.currentFieldIndex = 0;
    this.processedFields.clear();
    
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    
    chrome.storage.local.set({formFillerStatus: 'stopped'});
  }
  
  updateSpeed(newSpeed) {
    this.speed = newSpeed;
    chrome.storage.local.set({formFillerSpeed: newSpeed});
    console.log('Velocidade atualizada para:', newSpeed, 'ms');
  }
}

// Instanciar o form filler
const formFiller = new AutoFormFiller();

// Listener para mensagens da popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Mensagem recebida:', request);
  
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
  return true;
});

console.log('Auto Form Filler carregado e pronto!');
