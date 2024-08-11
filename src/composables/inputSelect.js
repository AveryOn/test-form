import { computed, onMounted, ref, watch } from 'vue';

export default function useInputSelect(props, emit) {

    // ########################################   DATA   ###############################################
    const filterValue = ref('');                        // Значение фильтр-инпута 
    const selectedIndexOption = ref(null);              // Индекс опции, меняется при переключении фокуса опций клавишами ArrowUp и ArrowDown
    const selectedOption = ref(null);                   // Данные выбранной опции
    const isOpennedOptions = ref(false);                // Состояние отображения блока опций
    // NODES
    const selectOverlay = ref(null);                    // Главный контейнер текущего селект-меню
    const currentSelectInput = ref(null);               // Текущее селект меню
    const currentTextInput = ref(null);                 // Текстовый инпут для фильтрации опций
    const optionsBlock = ref(null);                     // Блок опций текущего селект-меню



    // ########################################   COMPUTED   ###############################################
    // Фильтрация опций по в фильтр-инпуту
    const filtereOptionsByNames = computed(() => {
        try {
            return props.options.filter((item) => computeLabel.value(item).toLowerCase().includes(filterValue.value));
        } catch (err) {
            console.error('/src/composables/inputSelect.js: filtereOptionsByNames =>', err);
        }
    });

    // Вычисление value атрибута (Если будет приходить в modelValue не строка а объект данных, то необходимо вычислить, какой ключ будет являтся value-атрибутом )
    // ** Компонент допускает как объекты, так и примитивные данные в качестве значений для опций
    const computeValue = computed(() => {
        return (inputValue) => {
            try {
                // Если приходящее v-model значение является строкой
                if(typeof inputValue === 'string') {
                    return inputValue;
                }
                else if(typeof inputValue === 'object' && inputValue !== null) {
                    if(props.optionValue) {
                        return inputValue[props.optionValue];
                    } 
                    else {
                        return JSON.stringify(inputValue);
                    }
                }
            } catch (err) {
                console.error('/src/composables/inputSelect.js: computeValue =>', err);
            }
        }
    });

    // Вычисление имени option
    const computeLabel = computed(() => {
        return (inputValue) => {
            try {
                if(typeof inputValue === 'string' || (typeof inputValue === 'number' && inputValue === inputValue)) {
                    return inputValue;
                } 
                else if (typeof inputValue === 'object' && inputValue !== null) {
                    if(props.optionLabel) {
                        return inputValue[props.optionLabel];
                    }
                    else {
                        return inputValue;
                    }
                }
            } catch (err) {
                console.error('/src/composables/inputSelect.js: computeLabel =>', err);
            }
        }
    });

    // вычисляет hover и selected классы для опций
    const computeOptionSelectClass = computed(() => {
        try {
            return (inputOption, indexOption) => {
                let readyClassList = { selected: false, hover: false };
                let correctedOption = inputOption;
                let correctedModelValue = props.modelValue;
                if(typeof inputOption === 'object' && inputOption !== null) {
                    correctedOption = JSON.stringify(inputOption);
                }
                if(typeof correctedModelValue === 'object' && correctedModelValue !== null) {
                    correctedModelValue = JSON.stringify(correctedModelValue);
                }
                // Определить класс selected для опции
                if(correctedModelValue && correctedOption) {
                    if(correctedModelValue === correctedOption) {
                        readyClassList.selected = true;
                    } 
                }
                // Определить класс hover для опции (Нужен для подсветки опции при выборе их клавишами стрелок)
                if(indexOption === selectedIndexOption.value) {
                    readyClassList.hover = true;
                }
                return readyClassList;
            }
        } catch (err) {
            console.error('/src/composables/inputSelect.js: computeOptionSelectClass =>', err);
        }

    });

    // ########################################   METHODS   ###############################################
    // Переключатель отображения блока опций
    function toggleOpennedOptions(state) {
        try {
            if(typeof state === 'boolean') return isOpennedOptions.value = state;
            if(isOpennedOptions.value) isOpennedOptions.value = false;
            else isOpennedOptions.value = true;
        } catch (err) {
            console.error('/src/composables/inputSelect.js: toggleOpennedOptions =>', err);
            throw err;
        }
    }

    // Сброс выбранной опции по нажатию на кнопку с крестиком
    function handlerResetValue() {
        try {
            selectedOption.value = null;
            emit('resetValue');
        } catch (err) {
            console.error('/src/composables/inputSelect.js: handlerResetValue =>', err);
            throw err;
        }
    }

    // Обработчик события change для селект-меню
    function handlerChangeOption(value, option) {
        try {
            selectedOption.value = option;
            let readyValue = value;
            if(typeof readyValue === 'string') {
                try {
                    readyValue = JSON.parse(readyValue);
                } catch (err) { }
            }
            emit('update:modelValue', readyValue);
            handlerCloseOptionsBlock();
        } catch (err) {
            console.error('/src/composables/inputSelect.js: handlerChangeOption =>', err);
            throw err;
        }
    }

    // Обновление позиции скролла для блока опций
    function updateScrollOptionsBlock(top = 0) {
        try {
            optionsBlock.value.scroll({
                top: (top - 60),
                behavior: 'smooth',
            });
        } catch (err) {
            console.error('/src/composables/inputSelect.js: updateScrollOptionsBlock =>', err);
        }
    }

    // Фокусирование опций с помощью кнопок (Фокус на ПРЕДЫДУЩЕЙ опции)
    function handlerHoverPrevOption() {
        try {
            if(selectedIndexOption.value !== null && selectedIndexOption.value !== 0) {
                selectedIndexOption.value--;
                let currentOptionNode = document.getElementById(`option-${props.name}-${selectedIndexOption.value}`);
                const offsetTop = currentOptionNode.offsetTop;
                // Пододвигать позицию скролла блока опций относительно активной опции
                updateScrollOptionsBlock(offsetTop);
            }
        } catch (err) {
            console.error('/src/composables/inputSelect.js: handlerHoverPrevOption =>', err);
        }
    }

    // Фокусирование опций с помощью кнопок (Фокус на СЛЕДУЮЩЕЙ опции)
    function handlerHoverNextOption() {
        try {
            if(selectedIndexOption.value === null) {
                selectedIndexOption.value = 0;
            }
            else if((selectedIndexOption.value + 1) <= (props.options.length - 1)) {
                selectedIndexOption.value++;
                let currentOptionNode = document.getElementById(`option-${props.name}-${selectedIndexOption.value}`);
                const offsetTop = currentOptionNode.offsetTop;
                // Пододвигать позицию скролла блока опций относительно активной опции
                updateScrollOptionsBlock(offsetTop);
            }
        } catch (err) {
            console.error('/src/composables/inputSelect.js: handlerHoverNextOption =>', err);
        }
    }

    // Обработчик закрытия блока опций
    function handlerCloseOptionsBlock() {
        try {
            isOpennedOptions.value = false;
            selectedIndexOption.value = null;
            currentTextInput.value?.blur();
        } catch (err) {
            console.error('/src/composables/inputSelect.js: handlerCloseOptionsBlock =>', err);
        }
    }

    // ########################################   WATCH   ###############################################

    // Наблюдатель отправляет уведомление в род компонент о том что блок опций открывается
    watch(() => isOpennedOptions.value, (newValue) => {
        try {
            if(newValue === true) {
                emit('openOptions');
            }
        } catch (err) {
            console.error('/src/composables/inputSelect.js: watch[@openOptions] =>', err);
        }
    });
    // При изменении выбранной опции (modelValue) извне, применяем изменения и в данном компоненте
    watch(() => props.modelValue, (newValue) => {
        try {
            selectedOption.value = newValue;
        } catch (err) {
            console.error('/src/composables/inputSelect.js: watch[@update:modelValue] =>', err);
        }
    });


    // ########################################   LIFECYCLE HOOKS   ###############################################
    onMounted(() => {
        document.addEventListener('keydown', (event) => {
            try {
                // Выполняется только, если сам select или его внутренний текстовый инпут находятся в фокусе
                if(document.activeElement === currentSelectInput.value || document.activeElement === currentTextInput.value) {
                    // для скрытия окна опций и выхода из фокуса
                    if(event.key === 'Escape') {
                        if(isOpennedOptions.value === true) {
                            return handlerCloseOptionsBlock();
                        }
                    }
                    // навигация по опциям с помощью стрелок
                    if(event.key === 'ArrowUp') {
                        return handlerHoverPrevOption();  // Пред опция
                    }
                    if(event.key === 'ArrowDown') {
                        return handlerHoverNextOption();   // След  опция
                    }
                    // При нажатии на Tab, селект который был в фокусе закрывается чтобы переключить фокус на след DOM-узел
                    if(event.key === 'Tab') {
                        return handlerCloseOptionsBlock();
                    }
                    if(event.key === 'Enter') {
                        isOpennedOptions.value = true;
                        if(isOpennedOptions.value === true) {
                            if(selectedIndexOption.value !== null) {
                                // Селект опции, точно так же как это было бы сделано по клику на саму опцию
                                handlerChangeOption(computeValue.value(props.options[selectedIndexOption.value]), props.options[selectedIndexOption.value]);
                            }
                        }
                    }
                }
            } catch (err) {
                console.error('/src/components/UI/inputSelectComp.vue: mounted[@keydown] =>', err);
            }
        });
        // Обработка клика на любое место документа кроме самого селект меню - спровоцирует его закрытие если оно было открыто
        document.addEventListener('click', (event) => {
            try {
                if(isOpennedOptions.value === true) {
                    if(!selectOverlay.value?.contains(event.target)) {
                        return handlerCloseOptionsBlock();
                    }
                }
            } catch (err) {
                console.error('/src/components/UI/inputSelectComp.vue: mounted[@click] =>', err);
            }
        });
    });


    return {
        // DATA
        filterValue,
        selectedOption,
        isOpennedOptions,
        selectOverlay,
        currentSelectInput,
        currentTextInput,
        optionsBlock,
        // COMPUTED
        filtereOptionsByNames,
        computeValue,
        computeLabel,
        computeOptionSelectClass,
        // METHODS
        toggleOpennedOptions,
        handlerResetValue,
        handlerChangeOption,
    }
}