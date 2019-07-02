class CalcController {

    constructor() {

        this._lastOperator;
        this._lastNumber;

        this._locale        = "pt-BR";
        this._operation     = [];
        this._calculationEl = document.querySelector(".calculation");
        this._dateEl        = document.querySelector(".date");
        this._timeEl        = document.querySelector(".time");
        this._moment;

        this.initialize();
        this.initializeButtonsEvents();
    } // end constructor

    /**
     * Inicia o objeto
     */
    initialize() {

        this.setDisplayDateTime();

        setInterval(() => {
            this.setDisplayDateTime();
        }, 1000);

        this.setLastNumberToDisplay();
    } // end initialize

    /**
     * Configura os eventos nos botões
     */
    initializeButtonsEvents() {
        let buttons = document.querySelectorAll('.btn');

        buttons.forEach((button) => {
            this.addEventListenerAll(button, 'click drag', e => {
                let valueBtn = button.className.replace("btn btn-", "");
                this.execButton(valueBtn);
            });
        }) // end forEach
    } // initializeButtonsEvents

    /**
     * O evento a ser atribuído ao botão.
     * @param {*} value
     */
    execButton(value) {

        switch (value) {
            case "ac":
                this.clearAll();
                break;

            case "ce":
                this.clearEntry();
                break;

            case "division":
                this.addOperation("/")
                break;

            case "percent":
                this.addOperation("%")
                break;

            case "multiplication":
                this.addOperation("*")
                break;

            case "minus":
                this.addOperation("-")
                break;

            case "plus":
                this.addOperation("+")
                break;

            case "equal":
                this.calc();
                break;

            case "point":
                this.addPoint()
                break;

            case "0":
            case "1":
            case "2":
            case "3":
            case "4":
            case "5":
            case "6":
            case "7":
            case "8":
            case "9":
                this.addOperation(value);
                break;

            default:
                this.setError();
        }

    } // end execButton

    addPoint() {
        let lastOperation = this.getLastOperation();

        if (this.isOperator(lastOperation) || !lastOperation) {
            this.pushOperation('0.');
        } else {
            this.setLastOperation(lastOperation.toString() + ".");
        }

        this.setLastNumberToDisplay();
    }

    /**
     * Ao passar uma string de eventos separadas por espaço, cada evento
     * é atribuído ao botão.
     * @param {*} element
     * @param {*} events
     * @param {*} fn
     */
    addEventListenerAll(element, events, fn) {
        events.split(" ").forEach(event => {
            element.addEventListener(event, fn, false);
        });
    } // end addEventListenerAll

    get locale() {
        return this._locale;
    }

    set locale(value) {
        this._locale = value;
    }

    get displayCalculation() {
        return this._calculationEl.innerHTML;
    }

    set displayCalculation(value) {
        this._calculationEl.innerHTML = value;
    }

    get displayDate() {
        return this._dateEl.innerHTML;
    }

    set displayDate(value) {
        this._dateEl.innerHTML = value;
    }

    get displayTime() {
        return this._timeEl.innerHTML;
    }

    set displayTime(value) {
        this._timeEl.innerHTML = value;
    }

    get moment() {
        return new Date();
    }

    /**
     * Exibe nos controles a data e hora atual
     */
    setDisplayDateTime() {
        this.displayDate = this.moment.toLocaleDateString(this.locale);
        this.displayTime = this.moment.toLocaleTimeString(this.locale);
    } // end setDisplayDateTime

    /**
     * Limpa todas as operações e entrada atual
     */
    clearAll() {
        this._operation = [];
        this.clearEntry();
        this._lastNumber = 0;
        this._lastOperator = '';
    } // end clearAll

    /**
     * Limpa a entrada atual
     */
    clearEntry() {
        this.displayCalculation = 0;
        if (!this.isOperator(this.getLastOperation())) {
            this._operation.pop();
        }
    } // end clearEntry

    /**
     * Exibe um erro no display
     */
    setError() {
        this.displayCalculation = "Error";
    } // setError

    /**
     * Verifica se é um operador
     */
    isOperator(value) {
        return ["+", "-", "=", "*", "%", "/"].indexOf(value) > -1;
    } // end isOperator

    /**
     * Insere um novo valor, operando ou operador, no array _operation
     * @param {*} value
     */
    pushOperation(value) {
        this._operation.push(value);

        if (this._operation.length > 3) {
            this.calc();
        }
    } // pushOperation

    getResult() {
        return eval(this._operation.join(""));
    }

    /**
     * Calcula os dois valores atuais.
     */
    calc() {

        let lastOperator = '';
        let result       = 0;

        this._lastOperator = this.getLastItem();

        if (this._operation.length < 3) {
            let firstNumber = this._operation[0];
            this._operation = [firstNumber, this._lastOperator, this._lastNumber];
        }

        if (this._operation.length > 3) {
            lastOperator = this._operation.pop();
            this._lastNumber = this.getResult();
        } else {
            if (this._operation.length === 3) {
                this._lastNumber = this.getLastItem(false);
            } // end if
        }

        console.log(this._lastNumber, this._lastOperator);

        result = this.getResult();

        if (lastOperator == '%') {
            result /= 100;
            this._operation = [result];
        } else {
            this._operation = [result];
            if (lastOperator) {
                this._operation.push(lastOperator);
            } // end if
        } // end if

        this.setLastNumberToDisplay();
    } // end calc

    getLastItem(isOperator = true) {

        let lastItem;

        for (let index = this._operation.length - 1; index >= 0; index--) {
            if (this.isOperator(this._operation[index]) == isOperator) {
                lastItem = this._operation[index];
                break;
            }
        }

        if (!lastItem) {
            lastItem = (isOperator) ? this._lastOperator : this._lastNumber;
        }

        return lastItem;

    }

    setLastNumberToDisplay() {

        let lastNumber = this.getLastItem(false);

        if (!lastNumber) {
            lastNumber = 0;
        }

        this.displayCalculation = lastNumber;
    }

    addOperation(value) {

        if (isNaN(this.getLastOperation())) {
            if (this.isOperator(value)) {
                this.setLastOperation(value);
            } else {
                this.pushOperation(parseInt(value));
                this.setLastNumberToDisplay();
            } // end if
        } else {
            if (this.isOperator(value)) {
                this.pushOperation(value);
            } else {
                let newValue = this.getLastOperation().toString() + value.toString();
                this.setLastOperation(parseFloat(newValue));
                this.setLastNumberToDisplay();
            } // end if
        } // end if

    } // end addOperation

    /**
     * Verifica qual foi a última operação inserida no array _operation.
     */
    getLastOperation() {
        return this._operation[this._operation.length - 1];
    } // end getLastOperation

    /**
     * Define um valor na última posição do array
     * @param {*} value
     */
    setLastOperation(value) {
        this._operation[this._operation.length - 1] = value;
    } // end setLastOperation
}
