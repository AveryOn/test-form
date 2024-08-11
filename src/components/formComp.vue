<template>
    <form class="form" @submit.prevent>
        <h1 class="form-title">Заполните форму</h1>
        <div class="form-content">
            <!-- Выбор города -->
            <input-select-comp 
            class="form-select-item"
            :name="'city'"
            :select-id="'select-city'"
            :options-key="'id'"
            :options="cities" 
            v-model="formData.city" 
            @update:modelValue="handlerChangeCity"
            @reset-value="formData.city = null"
            @open-options="handlerOpenCities"
            :option-label="'name'"
            :filterable="true"
            :loading="isLoadingCitiesData"
            :placeholder="'Выберите город'"
            ></input-select-comp>

            <!-- Выбор цеха -->
            <input-select-comp 
            class="form-select-item"
            :name="'workshop'"
            :select-id="'select-workshop'"
            :options-key="'id'"
            :options="filteredWorkshopsByCities" 
            v-model="formData.workshop" 
            @update:modelValue="handlerChangeWorkshop"
            @reset-value="formData.workshop = null"
            @open-options="handlerOpenWorkshops"
            option-label="name"
            :filterable="true"
            :loading="isLoadingWorkshopsData"
            :placeholder="'Выберите цех'"
            ></input-select-comp>

            <!-- Выбор сотрудника -->
            <input-select-comp 
            class="form-select-item"
            :name="'employee'"
            :select-id="'select-employee'"
            :options-key="'id'"
            :options="filteredEmployeesByWorkshop" 
            v-model="formData.employee" 
            @update:modelValue="handlerChangeEmployee"
            @reset-value="formData.employee = null"
            @open-options="handlerOpenEmployees"
            option-label="name"
            :filterable="true"
            :loading="isLoadingEmployeesData"
            :placeholder="'Выберите сотрудника'"
            ></input-select-comp>

            <!-- Выбор бригады -->
            <input-select-comp 
            class="form-select-item"
            :name="'crew'"
            :options-key="'id'"
            :select-id="'select-crew'"
            :options="crews" 
            v-model="formData.crew" 
            @reset-value="formData.crew = null"
            @open-options="handlerOpenCrews"
            option-label="name"
            :filterable="true"
            :loading="isLoadingCrewsData"
            :placeholder="'Выберите бригаду'"
            ></input-select-comp>

            <!-- Выбор смены -->
            <input-select-comp 
            class="form-select-item"
            :name="'shift'"
            :select-id="'select-shift'"
            :options-key="'id'"
            :options="shifts" 
            v-model="formData.shift" 
            @reset-value="formData.shift = null"
            @open-options="handlerOpenShifts"
            option-label="name"
            :filterable="true"
            :loading="isLoadingShiftsData"
            :placeholder="'Выберите смену'"
            ></input-select-comp>

        </div>
        <div class="form-actions">
            <btn-comp
            class="sumbit-btn"
            :loading="isLoadingSaveForm" 
            :disabled="isDisabledSubmitBtn"
            :label="'Сохранить'"
            :icon="mdiCheck"
            @click="submitForm"
            ></btn-comp>
        </div>
    </form>
</template>

<script setup>
import useForm from '@/composables/formComposable';
import { mdiCheck } from '@mdi/js';


// ########################################   COMPOSABLES   ###############################################
const {
    // DATA
    formData,
    isLoadingSaveForm,
    isLoadingCitiesData,
    isLoadingWorkshopsData,
    isLoadingEmployeesData,
    isLoadingCrewsData,
    isLoadingShiftsData,
    cities,
    crews,
    shifts,

    // COMPUTED
    filteredWorkshopsByCities,
    filteredEmployeesByWorkshop,
    isDisabledSubmitBtn,

    // METHODS
    handlerOpenCities,
    handlerOpenWorkshops,
    handlerOpenEmployees,
    handlerOpenCrews,
    handlerOpenShifts,
    handlerChangeCity,
    handlerChangeWorkshop,
    handlerChangeEmployee,
    submitForm,
} = useForm();

</script>

<style scoped>
.form {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 400px;
    width: max-content;
    min-height: 200px;
    height: max-content;
    background-color: var(--basic-bg);
    box-shadow: var(--basic-shadow);
    border-radius: 5px;
    padding: 1.7rem 2.5rem;
}
.form-title {
    font-size: 1.7rem;
    margin-bottom: 1rem;
    color: rgb(80, 80, 80);
    font-weight: 300;
}
.form-content {
    width: max-content;
}
.form-select-item {
    width: 350px !important;
}
.form-select-item + .form-select-item {
    margin-top: 0.8rem;
}
.form-actions {
    width: 100%;
    padding: 1.3rem 0 0 0;
}
.sumbit-btn {
    margin-left: auto;
}
</style>