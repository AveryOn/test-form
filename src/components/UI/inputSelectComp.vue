<template>
    <div ref="selectOverlay" class="select-input__overlay">
        <label class="select-input" :for="props.id" @click="toggleOpennedOptions">
            <span @click="toggleOpennedOptions" class="input-block"  style="user-select: none;">
                <select ref="currentSelectInput" :id="props.id"></select>
                <input 
                v-if="props.filterable && !selectedOption" 
                class="text-field" 
                ref="currentTextInput" 
                :placeholder="props.placeholder" 
                @click="() => toggleOpennedOptions(true)"
                @focus="() => toggleOpennedOptions(true)"
                v-model.trim="filterValue"
                type="text"
                >
                <span @click="toggleOpennedOptions" v-else-if="selectedOption">{{ computeLabel(selectedOption) }}</span>
                <span @click="toggleOpennedOptions" v-else class="select-placeholder">{{ props.placeholder }}</span>
            </span>
            <span class="icon-block">
                <svg-icon v-if="props.modelValue" class="clearable-icon" @click.stop="handlerResetValue" type="mdi" :size="18" :path="mdiCloseCircleOutline"></svg-icon>
                <svg-icon type="mdi" :size="18" :path="mdiChevronDown"></svg-icon>
            </span>

        </label>
        <!-- Блок опций селект меню -->
        <div ref="optionsBlock" v-if="props.options.length" class="options-block" :class="isOpennedOptions? 'openned': ''">
            <span v-if="props.loading" class="loading-options">
                <svg-icon class="loading-options-icon" type="mdi" :size="30" :path="mdiLoading"></svg-icon>
            </span>
            <TransitionGroup name="option-list">
                <div
                v-for="(option, index) in filtereOptionsByNames" 
                class="option"
                :id="`option-${props.name}-${index}`"
                :key="option[props.optionsKey] ?? JSON.stringify(option)"
                @click="() => handlerChangeOption(computeValue(option), option)"
                :class="computeOptionSelectClass(option, index)"
                >
                    {{ computeLabel(option) }}
                </div>
            </TransitionGroup>
        </div>
        <div v-else class="options-empty" :class="isOpennedOptions? 'openned': ''">
            <span v-if="props.loading" class="loading-options">
                <svg-icon class="loading-options-icon" type="mdi" :size="20" :path="mdiLoading"></svg-icon>
            </span>
            <span class="options-empty-label">Нет данных</span>
        </div>
    </div>
</template>

<script setup>
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiLoading, mdiChevronDown, mdiCloseCircleOutline } from '@mdi/js';
import { defineProps, defineEmits } from 'vue';
import useInputSelect from '@/composables/inputSelect';

// ########################################   PROPS   ###############################################
const props = defineProps({
    name: {
        type: String,
        required: true,
    },
    loading: {
        type: Boolean,
        default: false,
        required: false,
    },
    optionsKey: {
        type: String,
        default: null,
        required: false,
    },
    selectId: {
        type: [String, Number],
        default: null,
        required: false,
    },
    modelValue: {
        type: [String, Number, Object],
        required: false,
        default: null,
    },
    options: {
        type: Array,
        required: false,
        default: () => [],
    },
    optionLabel: {
        type: String,
        required: false,
        default: null,
    },
    optionValue: {
        type: String,
        required: false,
        default: null,
    },
    filterable: {
        type: Boolean,
        required: false,
        default: false,
    },
    placeholder: {
        type: String,
        required: false,
        default: 'Выберите элемент',
    }
});

// ########################################   EMITS   ###############################################
const emit = defineEmits(['update:modelValue', 'resetValue', 'openOptions']);

const {
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
} = useInputSelect(props, emit);

</script>

<style scoped>
.select-input__overlay {
    position: relative;
    min-width: 220px;
    width: max-content;
    height: max-content;
}
.select-input {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: max-content;
    width: 100%;
    border: 1px solid var(--input-border-color);
    box-shadow: var(--input-shadow);
    padding: .5rem .7rem;
    background-color: var(--input-bg);
    color: var(--input-fg);
    border-radius: 5px;
    font-family: var(--font);
    overflow: visible !important; 
    z-index: 6;
}
.select-input:focus-within {
    border: 1px solid var(--input-border-focus-color);
}
.select-input select {
    width: 0;
    height: 0;
    border: none;
    background-color: transparent;
    outline: rgba(0,0,0,0);
}
.select-placeholder {
    color: var(--input-placeholder-fg);
    font-size: 0.9rem;
}
.text-field {
    border: none;
    background-color: transparent;
    outline: rgba(0,0,0,0);
    padding: 0 0.3rem;
    color: var(--input-fg);
    font-weight: 500;
    font-family: var(--font);
}
.text-field::placeholder {
    color: var(--input-placeholder-fg);
    font-size: 0.9rem;
}
.icon-block {
    display: flex;
    align-items: center;
    justify-content: center;
}
.clearable-icon {
    transition: all 0.3s ease;
    cursor: pointer;
}
.clearable-icon:hover {
    color: rgb(196, 94, 94) !important;
    transition: all 0.3s ease;
}
.options-block {
    overflow-y: auto;
    overflow-x: hidden;
    position: absolute;
    width: 100%;
    height: 0;
    background-color: var(--basic-bg);
    color: var(--input-fg);
    border-radius: 5px;
    border: none;
    box-shadow: var(--input-shadow);
    transition: all 0.15s ease;
    transform: translateY(0.2rem);
    opacity: 0;
    z-index: 7;
    padding: 0;
}
/* Стилизация скроллбара */
.options-block::-webkit-scrollbar {
    width: 4px;
    height: 4px;
}
.options-block::-webkit-scrollbar-track {
    background: var(--input-bg);
    border-radius: 4px;
}
.options-block::-webkit-scrollbar-thumb {
    background: var(--select-scroll-bg);
    border-radius: 4px;
}
.options-block::-webkit-scrollbar-thumb:hover {
    background: var(--select-scroll-hover-bg);
}
.options-block.openned {
    height: 150px;
    opacity: 1;
    padding: 0.5rem 0.3rem;
    border: 1px solid var(--input-border-color);
}
.loading-options {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    right: 0;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 8;
    background-color: var(--input-bg);
}
.loading-options-icon {
    color: var(--select-input-loading-icon-color);
    animation-name: loading;
    animation-duration: .6s;
    animation-iteration-count: infinite;
}
.options-empty {
    overflow: hidden;
    position: absolute;
    width: 100%;
    height: 0;
    background-color: var(--basic-bg);
    color: var(--input-fg);
    border-radius: 5px;
    border: none;
    box-shadow: var(--input-shadow);
    transition: all 0.15s ease;
    transform: translateY(0.2rem);
    opacity: 0;
    z-index: 7;
    padding: 0;
}
.options-empty.openned {
    height: 40px;
    opacity: 1;
    padding: 0.5rem 0.3rem;
    border: 1px solid var(--input-border-color);
}
.options-empty-label {
    font-weight: 200;
    font-size: 0.9rem;
    font-style: italic;
    font-family: var(--font);
    padding: 0 .7rem;
}
.option {
    width: 100%;
    background-color: rgba(128, 128, 128, 0.1);
    transition: all 0.3s ease;
    border-radius: 3px;
    padding: .5rem .5rem;
    cursor: pointer;
}
.option + .option {
    margin-top: 0.2rem;
}
.option:hover {
    background-color: rgba(128, 128, 128, 0.3);
    transition: all 0.3s ease;
}
.option.selected {
    background-color: var(--input-option-select-bg);
}
.option.selected:hover {
    background-color: var(--input-option-select-hover-bg);
}
.option.hover {
    background-color: rgba(128, 128, 128, 0.3);
    transition: all 0.5s ease;
}
.option.hover.selected {
    transition: all 0.5s ease;
    background-color: var(--input-option-select-hover-bg);
}

.option-list-enter-active,
.option-list-leave-active {
    transition: all 0.3s ease;
}
.option-list-enter-from,
.option-list-leave-to {
    opacity: 0;
    transform: translateX(20px);
}

</style>