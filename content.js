class AutoFormFiller {
  constructor() {
    this.isRunning = false;
    this.isPaused = false;
    this.speed = 1000;
    this.currentFieldIndex = 0;
    this.processedFields = new Set();
    this.timeoutId = null;
    
    // Base de dados expandida de personagens
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
      'Shrek', 'Fiona', 'Donkey', 'Puss in Boots', 'Po', 'Tigress',
      'Viper', 'Mantis', 'Crane', 'Monkey', 'Master Shifu', 'Oogway'
    ];
    
    this.companies = [
      'SwordHealth', 'TechCorp', 'InnovateNow', 'DataSystems', 'CloudWorks',
      'NextGen Solutions', 'Digital Dynamics', 'Future Labs', 'SmartTech'
    ];
    
    this.jobTitles = [
      'Software Engineer', 'Product Manager', 'UX Designer', 'Data Scientist',
      'Marketing Specialist', 'Sales Representative', 'HR Manager', 'Consultant',
      'Project Manager', 'Business Analyst', 'Developer', 'Designer'
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
  
  getRandomCompany() {
    return this.companies[Math.floor(Math.random() * this.companies.length)];
  }
  
  getRandomJobTitle() {
    return this.jobTitles[Math.floor(Math.random() * this.jobTitles.length)];
  }
  
  generateEmail(name) {
    const cleanName = name.toLowerCase()
      .replace(/\s+/g, '.')
      .replace(/[^a-z0-9.]/g, '');
    const randomNum = Math.floor(Math.random() * 999) + 1;
    return `${cleanName}${randomNum}@swordhealth.com`;
  }
  
  generatePhoneNumber() {
    const formats = [
      `+351 9${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 10000000).toString().padStart(7, '0')}`,
      `9${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 10000000).toString().padStart(7, '0')}`,
      `+1 (${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`
    ];
    return formats[Math.floor(Math.random() * formats.length)];
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
  
  generateDateTime() {
    return `${this.generateDateISO()}T${this.generateTime()}`;
  }
  
  generateNumber(min = 1, max = 100) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  generateAge() {
    return Math.floor(Math.random() * 60) + 18;
  }
  
  generateSalary() {
    return Math.floor(Math.random() * 80000) + 20000;
  }
  
  generateURL() {
    const character = this.getRandomCharacter().toLowerCase().replace(/\s+/g, '');
    return `https://www.${character}.com`;
  }
  
  generatePassword() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }
  
  generateColor() {
    const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33F5', '#F5FF33', '#33FFF5'];
    return colors[Math.floor(Math.random() * colors.length)];
  }
  
  detectFieldType(element) {
    const id = element.id?.toLowerCase() || '';
    const name = element.name?.toLowerCase() || '';
    const placeholder = element.placeholder?.toLowerCase() || '';
    const label = this.getFieldLabel(element)?.toLowerCase() || '';
    const type = element.type?.toLowerCase() || 'text';
    const className = element.className?.toLowerCase() || '';
    const title = element.title?.toLowerCase() || '';
    
    const allText = `${id} ${name} ${placeholder} ${label} ${className} ${title}`.toLowerCase();
    
    console.log('Detectando campo:', {
      element,
      type,
      allText: allText.substring(0, 100),
      tagName: element.tagName
    });
    
    // Tipos específicos por input type
    switch (type) {
      case 'email': return 'email';
      case 'tel': return 'phone';
      case 'date': return 'date';
      case 'time': return 'time';
      case 'datetime-local': return 'datetime';
      case 'number': return 'number';
      case 'range': return 'range';
      case 'url': return 'url';
      case 'password': return 'password';
      case 'color': return 'color';
      case 'search': return 'search';
      case 'month': return 'month';
      case 'week': return 'week';
    }
    
    // Email
    if (allText.includes('email') || allText.includes('e-mail') || allText.includes('mail')) {
      return 'email';
    }
    
    // Nome
    if (allText.includes('name') || allText.includes('nome') || 
        allText.includes('first') || allText.includes('last') || 
        allText.includes('primeiro') || allText.includes('último') ||
        allText.includes('apelido') || allText.includes('surname') ||
        allText.includes('fullname') || allText.includes('full_name') ||
        allText.includes('firstname') || allText.includes('lastname')) {
      return 'name';
    }
    
    // Telefone
    if (allText.includes('phone') || allText.includes('tel') || 
        allText.includes('telefone') || allText.includes('móvel') || 
        allText.includes('celular') || allText.includes('contact') ||
        allText.includes('mobile') || allText.includes('number')) {
      return 'phone';
    }
    
    // Data
    if (allText.includes('date') || allText.includes('birth') || 
        allText.includes('data') || allText.includes('nascimento') || 
        allText.includes('aniversário') || allText.includes('birthday') ||
        allText.includes('day') || allText.includes('month') || allText.includes('year')) {
      return 'date';
    }
    
    // Endereço
    if (allText.includes('address') || allText.includes('endereço') || 
        allText.includes('morada') || allText.includes('rua') || 
        allText.includes('street') || allText.includes('avenue') ||
        allText.includes('location') || allText.includes('local')) {
      return 'address';
    }
    
    // Cidade
    if (allText.includes('city') || allText.includes('cidade') ||
        allText.includes('town') || allText.includes('municipality')) {
      return 'city';
    }
    
    // Código postal
    if (allText.includes('postal') || allText.includes('zip') || 
        allText.includes('código') || allText.includes('postcode')) {
      return 'postal';
    }
    
    // País
    if (allText.includes('country') || allText.includes('país') ||
        allText.includes('nation') || allText.includes('nationality')) {
      return 'country';
    }
    
    // Empresa
    if (allText.includes('company') || allText.includes('empresa') ||
        allText.includes('organization') || allText.includes('employer') ||
        allText.includes('business') || allText.includes('corp')) {
      return 'company';
    }
    
    // Trabalho/Profissão
    if (allText.includes('job') || allText.includes('work') || 
        allText.includes('profession') || allText.includes('occupation') ||
        allText.includes('career') || allText.includes('position') ||
        allText.includes('title') || allText.includes('role')) {
      return 'job';
    }
    
    // Idade
    if (allText.includes('age') || allText.includes('idade') ||
        allText.includes('years') || allText.includes('anos')) {
      return 'age';
    }
    
    // Salário
    if (allText.includes('salary') || allText.includes('salário') ||
        allText.includes('wage') || allText.includes('income') ||
        allText.includes('pay') || allText.includes('earning')) {
      return 'salary';
    }
    
    // URL/Website
    if (allText.includes('url') || allText.includes('website') ||
        allText.includes('site') || allText.includes('link') ||
        allText.includes('web') || allText.includes('homepage')) {
      return 'url';
    }
    
    // Comentários/Mensagem
    if (allText.includes('comment') || allText.includes('message') ||
        allText.includes('description') || allText.includes('note') ||
        allText.includes('feedback') || allText.includes('review') ||
        allText.includes('texto') || allText.includes('mensagem') ||
        element.tagName === 'TEXTAREA') {
      return 'message';
    }
    
    return 'text';
  }
  
  getFieldLabel(element) {
    // Procurar label associada
    if (element.id) {
      const label = document.querySelector(`label[for="${element.id}"]`);
      if (label) return label.textContent.trim();
    }
    
    // Procurar label pai
    const parentLabel = element.closest('label');
    if (parentLabel) return parentLabel.textContent.trim();
    
    // Procurar label anterior
    let sibling = element.previousElementSibling;
    while (sibling) {
      if (sibling.tagName === 'LABEL') {
        return sibling.textContent.trim();
      }
      if (sibling.textContent && sibling.textContent.trim() && 
          sibling.textContent.trim().length < 50) {
        return sibling.textContent.trim();
      }
      sibling = sibling.previousElementSibling;
    }
    
    // Procurar texto próximo
    const parent = element.parentElement;
    if (parent) {
      const textNodes = Array.from(parent.childNodes)
        .filter(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim())
        .map(node => node.textContent.trim());
      
      if (textNodes.length > 0) {
        return textNodes[0];
      }
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
        return element.type === 'date' ? this.generateDateISO() : this.generateDate();
      
      case 'time':
        return this.generateTime();
      
      case 'datetime':
        return this.generateDateTime();
      
      case 'month':
        const year = Math.floor(Math.random() * 30) + 1990;
        const month = Math.floor(Math.random() * 12) + 1;
        return `${year}-${month.toString().padStart(2, '0')}`;
      
      case 'week':
        const weekYear = Math.floor(Math.random() * 30) + 1990;
        const week = Math.floor(Math.random() * 52) + 1;
        return `${weekYear}-W${week.toString().padStart(2, '0')}`;
      
      case 'number':
        if (element.min && element.max) {
          return this.generateNumber(parseInt(element.min), parseInt(element.max));
        }
        return this.generateNumber();
      
      case 'range':
        const min = parseInt(element.min) || 0;
        const max = parseInt(element.max) || 100;
        return this.generateNumber(min, max);
      
      case 'address':
        return this.generateAddress();
      
      case 'city':
        return this.generateCity();
      
      case 'postal':
        return this.generatePostalCode();
      
      case 'country':
        return 'Portugal';
      
      case 'company':
        return this.getRandomCompany();
      
      case 'job':
        return this.getRandomJobTitle();
      
      case 'age':
        return this.generateAge();
      
      case 'salary':
        return this.generateSalary();
      
      case 'url':
        return this.generateURL();
      
      case 'password':
        return this.generatePassword();
      
      case 'color':
        return this.generateColor();
      
      case 'search':
        return character;
      
      case 'message':
        return `Olá! Sou ${character} e estou muito interessado/a nesta oportunidade. Tenho experiência relevante e estou ansioso/a por contribuir para o vosso projeto.`;
      
      default:
        return character;
    }
  }
  
  generateAddress() {
    const streets = [
      'Rua da Liberdade', 'Av. da República', 'Rua Augusta', 'Rua do Carmo', 
      'Av. Almirante Reis', 'Rua de Santa Catarina', 'Av. dos Aliados',
      'Rua das Flores', 'Praça do Comércio', 'Rua Garrett'
    ];
    const street = streets[Math.floor(Math.random() * streets.length)];
    const number = Math.floor(Math.random() * 999) + 1;
    return `${street}, ${number}`;
  }
  
  generateCity() {
    const cities = [
      'Lisboa', 'Porto', 'Braga', 'Coimbra', 'Faro', 'Aveiro', 'Viseu', 
      'Évora', 'Setúbal', 'Leiria', 'Vila Nova de Gaia', 'Amadora'
    ];
    return cities[Math.floor(Math.random() * cities.length)];
  }
  
  generatePostalCode() {
    return `${Math.floor(Math.random() * 9999) + 1000}-${Math.floor(Math.random() * 999).toString().padStart(3, '0')}`;
  }
  
  getFormFields() {
    // Selecionar TODOS os tipos de input possíveis
    const selectors = [
      'input[type="text"]:not([readonly]):not([disabled])',
      'input[type="email"]:not([readonly]):not([disabled])',
      'input[type="tel"]:not([readonly]):not([disabled])',
      'input[type="date"]:not([readonly]):not([disabled])',
      'input[type="time"]:not([readonly]):not([disabled])',
      'input[type="datetime-local"]:not([readonly]):not([disabled])',
      'input[type="number"]:not([readonly]):not([disabled])',
      'input[type="range"]:not([readonly]):not([disabled])',
      'input[type="url"]:not([readonly]):not([disabled])',
      'input[type="password"]:not([readonly]):not([disabled])',
      'input[type="color"]:not([readonly]):not([disabled])',
      'input[type="search"]:not([readonly]):not([disabled])',
      'input[type="month"]:not([readonly]):not([disabled])',
      'input[type="week"]:not([readonly]):not([disabled])',
      'input:not([type]):not([readonly]):not([disabled]):not([type="submit"]):not([type="button"]):not([type="reset"]):not([type="file"]):not([type="image"]):not([type="hidden"])',
      'textarea:not([readonly]):not([disabled])',
      'select:not([disabled])',
      '[contenteditable="true"]'
    ];
    
    const fields = Array.from(document.querySelectorAll(selectors.join(', ')))
      .filter(field => {
        // Verificar se está visível
        const style = window.getComputedStyle(field);
        const isVisible = style.display !== 'none' && 
                         style.visibility !== 'hidden' && 
                         field.offsetWidth > 0 && 
                         field.offsetHeight > 0 &&
                         style.opacity !== '0';
        
        // Verificar se não é um campo de submit/button
        const isFormField = !['submit', 'button', 'reset', 'file', 'image', 'hidden'].includes(field.type);
        
        return isVisible && isFormField;
      });
    
    console.log('Campos encontrados:', fields.length, fields);
    return fields;
  }
  
  async fillField(field) {
    return new Promise((resolve) => {
      const fieldKey = this.getFieldKey(field);
      if (this.processedFields.has(fieldKey)) {
        resolve();
        return;
      }
      
      // Scroll para o campo
      field.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // Destacar o campo
      const originalStyle = field.style.cssText;
      field.style.border = '3px solid #4CAF50';
      field.style.boxShadow = '0 0 10px rgba(76, 175, 80, 0.5)';
      field.style.transition = 'all 0.3s ease';
      
      setTimeout(() => {
        try {
          // Focar no campo
          field.focus();
          
          const fieldType = this.detectFieldType(field);
          console.log('Preenchendo campo:', {
            type: fieldType,
            tagName: field.tagName,
            inputType: field.type,
            id: field.id,
            name: field.name
          });
          
          if (field.tagName === 'SELECT') {
            // Preencher select
            const options = Array.from(field.options)
              .filter(opt => opt.value && opt.value !== '' && opt.value !== 'default');
            if (options.length > 0) {
              const randomOption = options[Math.floor(Math.random() * options.length)];
              field.value = randomOption.value;
              field.selectedIndex = randomOption.index;
            }
          } else if (field.hasAttribute('contenteditable')) {
            // Preencher contenteditable
            const value = this.getValueForField(fieldType, field);
            field.textContent = value;
          } else {
            // Preencher input/textarea
            const value = this.getValueForField(fieldType, field);
            
            // Limpar campo primeiro
            field.value = '';
            
            // Simular digitação para campos mais sensíveis
            if (field.type === 'password' || fieldType === 'email') {
              this.simulateTyping(field, value);
            } else {
              field.value = value;
            }
          }
          
          // Disparar todos os eventos possíveis
          const events = ['input', 'change', 'blur', 'keyup', 'keydown', 'focus'];
          events.forEach(eventType => {
            const event = new Event(eventType, { bubbles: true, cancelable: true });
            field.dispatchEvent(event);
          });
          
          // Disparar evento customizado para React/Vue
          const customEvent = new CustomEvent('input', {
            bubbles: true,
            detail: { value: field.value }
          });
          field.dispatchEvent(customEvent);
          
          this.processedFields.add(fieldKey);
          
          setTimeout(() => {
            // Restaurar estilo original
            field.style.cssText = originalStyle;
            resolve();
          }, 300);
          
        } catch (error) {
          console.error('Erro ao preencher campo:', error);
          field.style.cssText = originalStyle;
          resolve();
        }
      }, 200);
    });
  }
  
  simulateTyping(field, value) {
    let index = 0;
    const typeChar = () => {
      if (index < value.length) {
        field.value += value[index];
        field.dispatchEvent(new Event('input', { bubbles: true }));
        index++;
        setTimeout(typeChar, 50);
      }
    };
    typeChar();
  }
  
  getFieldKey(field) {
    return field.id || field.name || field.className || 
           field.placeholder || field.outerHTML.substring(0, 100);
  }
  
  findNextButton() {
    const buttonSelectors = [
      'button[type="submit"]',
      'input[type="submit"]',
      'button',
      'input[type="button"]',
      '[role="button"]',
      'a[href*="next"]',
      '.btn',
      '.button'
    ];
    
    const allButtons = [];
    buttonSelectors.forEach(selector => {
      allButtons.push(...Array.from(document.querySelectorAll(selector)));
    });
    
    // Filtrar botões visíveis
    const visibleButtons = allButtons.filter(btn => {
      const style = window.getComputedStyle(btn);
      return style.display !== 'none' && 
             style.visibility !== 'hidden' && 
             btn.offsetParent !== null;
    });
    
    // Procurar por palavras-chave
    const nextButton = visibleButtons.find(btn => {
      const text = (btn.textContent || btn.value || btn.title || '').toLowerCase();
      const keywords = [
        'next', 'continue', 'submit', 'send', 'enviar', 'próximo', 
        'continuar', 'seguinte', 'avançar', 'prosseguir', 'confirmar',
        'finalizar', 'concluir', 'finish', 'complete'
      ];
      return keywords.some(keyword => text.includes(keyword));
    });
    
    return nextButton || visibleButtons[visibleButtons.length - 1];
  }
  
  async processForm() {
    if (!this.isRunning || this.isPaused) return;
    
    const fields = this.getFormFields();
    console.log('Processando formulário. Campos encontrados:', fields.length);
    
    const unprocessedFields = fields.filter(field => {
      const fieldKey = this.getFieldKey(field);
      return !this.processedFields.has(fieldKey);
    });
    
    console.log('Campos não processados:', unprocessedFields.length);
    
    if (unprocessedFields.length === 0) {
      console.log('Todos os campos preenchidos. Procurando botão próximo...');
      const nextButton = this.findNextButton();
      if (nextButton) {
        console.log('Botão encontrado:', nextButton);
        setTimeout(() => {
          nextButton.click();
          this.processedFields.clear();
          this.currentFieldIndex = 0;
          
          setTimeout(() => {
            if (this.isRunning && !this.isPaused) {
              this.processForm();
            }
          }, 2000);
        }, 1000);
      } else {
        console.log('Nenhum botão próximo encontrado. Parando...');
        this.stop();
      }
      return;
    }
    
    if (this.currentFieldIndex < unprocessedFields.length) {
      const currentField = unprocessedFields[this.currentFieldIndex];
      console.log('Preenchendo campo:', this.currentFieldIndex + 1, 'de', unprocessedFields.length);
      
      await this.fillField(currentField);
      this.currentFieldIndex++;
      
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
