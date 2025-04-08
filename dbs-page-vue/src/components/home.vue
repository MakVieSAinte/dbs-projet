<script lang="ts">
import { defineComponent } from 'vue';
import MultiSelect from 'primevue/multiselect';

export default defineComponent({
  components: {
    MultiSelect,
  },
  data() {
    return {
      
      cities: [
        { name: 'New York', code: 'NY' },
        { name: 'Rome', code: 'RM' },
        { name: 'London', code: 'LDN' },
        { name: 'Istanbul', code: 'IST' },
        { name: 'Paris', code: 'PRS' },
      ],
      
      selectedCities: [],
    };
  },
});
</script>

<template>
  <div>
    <MultiSelect
      v-model="selectedCities"
      :options="cities"
      filter
      optionLabel="name"
      placeholder="Select Cities"
      :maxSelectedLabels="3"
      class="w-full md:w-80 border-red-500" style="background: red"
    />
  </div>
</template>

<style scoped>

</style>
