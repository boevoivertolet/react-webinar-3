/**
 * Хранилище состояния приложения
 */
class Store {
    #arrNumbers; // создал отдельное поле, в котором храню массив кодов

    // constructor(initState = {}) {
    //
    //     this.#arrNumbers = initState.list.map(el => el.code)// поместил все коды в массив
    //     this.state = initState;
    //     this.listeners = []; // Слушатели изменений состояния
    // }
    constructor(initState = {}) {
        initState = {
            ...initState,
            list: initState.list.map(item => ({...item, touchCount: 0})) // к каждому объекту массива добавляем поле touchCount со значением 0
        }
        this.#arrNumbers = initState.list.map(el => el.code)// поместил все коды в массив
        this.state = initState;
        this.listeners = []; // Слушатели изменений состояния
        console.log(initState)
    }

    /**
     * Подписка слушателя на изменения состояния
     * @param listener {Function}
     * @returns {Function} Функция отписки
     */
    subscribe(listener) {
        this.listeners.push(listener);
        // Возвращается функция для удаления добавленного слушателя
        return () => {
            this.listeners = this.listeners.filter(item => item !== listener);
        }
    }

    /**
     * Выбор состояния
     * @returns {Object}
     */
    getState() {
        return this.state;
    }

    /**
     * Установка состояния
     * @param newState {Object}
     */
    setState(newState) {
        this.state = newState;
        // Вызываем всех слушателей
        for (const listener of this.listeners) listener();
    }

    /**
     * Добавление новой записи
     */
    // addItem() {
    //   this.setState({
    //     ...this.state,
    //     list: [...this.state.list, {code: this.state.list.length + 1, title: 'Новая запись'}]
    //   })
    // };

    codeGenerator() {
        let maxNumber = Math.max(...this.#arrNumbers) // вычисляю максимальное значение кода в массиве.
        const randomCode = maxNumber + 1; // просто прибавляю единицу к максимальному числу
        this.#arrNumbers.push(randomCode);// и пушу в массив
        return randomCode; // возвращаю число, которое всегда будет больше на единицу самого большого значения имеющихся кодов.
    }

    addItem() {
        this.setState({
            ...this.state,
            list: [...this.state.list, {code: this.codeGenerator(), title: 'Новая запись', touchCount: 0}]//при создании новой записи добавил touchCount со значением 0
        })
    };

    /**
     * Удаление записи по коду
     * @param code
     */
    deleteItem(code, e) {
        e.stopPropagation() // Останавливаю всплытие на кнопке "удалить". Теперь выделение другого элемента сохраняется.
        this.setState({
            ...this.state,
            list: this.state.list.filter(item => item.code !== code)
        })
    };

    /**
     * Выделение записи по коду
     * @param code
     */
    // selectItem(code) {
    //   this.setState({
    //     ...this.state,
    //     list: this.state.list.map(item => {
    //       if (item.code === code) {
    //         item.selected = !item.selected;
    //       }
    //       return item;
    //     })
    //   })
    // }
    selectItem(code) {
        this.setState({
            ...this.state,
            list: this.state.list.map(item => {
                if (item.code === code) {
                    item.selected = !item.selected;
                    if (item.selected) { // если итем выделен
                        item.touchCount = item.touchCount + 1 // увеличиваю  touchCount на 1
                    }
                } else if (item.code !== code) { // теперь всё гаснет кроме выделенного.
                    item.selected = false
                }
                return item;
            })
        })
    }
}

export default Store;
