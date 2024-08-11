<template>
    <span class="btn-container" :class="props.disabled? 'disabled' : ''">
        <!-- Нативная кнопка для иммитации фокуса и тп -->
        <button @click.prevent :disabled="props.disabled"></button>

        <!-- Текстовая контентная часть кнопки -->
        <span class="btn">
            <span class="button-content" :class="computeIsHasLabelClass($slots.default)">
                {{ props.label }}
                <slot></slot>
            </span>
        </span>

        <!-- Блок иконок -->
        <span class="icons-block" :class="(!!props.loading || !!props.icon)? 'visible' : ''">
            <svg-icon v-if="props.loading" class="icon icon-loading" type="mdi" :size="15" :path="mdiLoading"></svg-icon>
            <svg-icon v-else-if="!props.loading && props.icon" class="icon" type="mdi" :size="17" :path="props.icon"></svg-icon>
        </span>
    </span>
</template>

<script setup>
import { defineProps, computed } from 'vue';
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiLoading } from '@mdi/js';

// ########################################   PROPS   ###############################################
const props = defineProps({
    disabled: {
        type: Boolean,
        required: false,
        default: false,
    },
    loading: {
        type: Boolean,
        required: false,
        default: false,
    },
    label: {
        type: String,
        required: false,
        default: '',
    },
    icon: {
        type: String,
        required: false,
        default: null,
    },
});


// ########################################   COMPUTED   ###############################################
// Свойство необходимо, чтобы отделить отступом контент от иконки (если она есть)
const computeIsHasLabelClass = computed(() => {
    try {
        return (slotValue) => {
            return ((slotValue || props.label) && (!!props.icon || props.loading))? 'text' : ''
        }
    } catch (err) {
        console.error('/src/components/UI/btnComp.vue:  computeIsHasLabelClass  => ', err);
        throw err;
    }
});

</script>


<style scoped>

.btn-container {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 2rem;
    width: max-content;
    border: 1px solid var(--btn-border-color);
    border-radius: 5px;
    padding: 0.3rem 0.8rem;
    cursor: pointer;
    background-color: var(--btn-bg);
    color: var(--btn-fg);
    box-shadow: var(--btn-shadow);
    transition: all var(--btn-duration) ease;
}
.btn-container:active {
    box-shadow: none;
}
.btn-container:hover {
    background-color: var(--btn-hover-bg);
    transition: all var(--btn-duration) ease;
}
.btn-container:hover .button-content{
    color: var(--btn-hover-fg);
    transition: all var(--btn-duration) ease;
}
.btn-container:hover .icon-loading {
    color: var(--btn-hover-fg);
    transition: all var(--btn-duration) ease;
}

.btn-container:focus-within {
    border: 1px solid var(--btn-border-focus-color);
}
.btn-container button {
    outline: rgba(0,0,0,0);
    background-color: transparent;
    border: none;
    cursor: pointer;
}
.btn-container.disabled {
    border: 1px solid var(--btn-disabled);
}
.btn-container.disabled:hover {
    background-color: white;
}
.btn-container.disabled:active {
    box-shadow: var(--btn-shadow);
}
.btn-container.disabled .button-content {
    color: var(--btn-disabled);
}
.btn-container.disabled .icon {
    color: var(--btn-disabled);
}
.btn {
    outline: rgba(0,0,0,0);
    background-color: transparent;
    border: none;
    cursor: pointer;
}
.button-content {
    font-size: 15px;
    color: var(--btn-fg);
    transition: all var(--btn-duration) ease;
    user-select: none;
}
.button-content.text {
    margin-right: 0.4rem;
}
.icons-block {
    scale: 0;
    display: flex;
    overflow: hidden;
    align-items: center;
    justify-content: center;
    padding-top: 0;
    transition: all .3s ease;
}
.icons-block.visible {
    scale: 1;
    padding-top: 0.15rem;
    transition: all .3s ease;
}
.icon {
    color: var(--btn-icon-color);
}
.icon-loading {
    animation-name: loading;
    animation-duration: .7s;
    animation-iteration-count: infinite;
    transition: all var(--btn-duration) ease;
}
</style>