<script setup>
</script>

<template>
  <div class="h-screen">
    <div class="flex justify-center items-center h-full p-0 ">
      <div class="flex flex-wrap w-full h-full">
        <div class="md:w-2/3 flex justify-center items-center bg-blue  h-full p-0 ">
          <img class="img-fluid" src="../../assets/img/image-5.png" alt="Hero Illustration">
        </div>
        <div class="md:w-1/3 flex flex-col items-center justify-center">
          <div class="text-center mb-5">
            <img class="img-fluid mb-5" src="../../assets/img/image93.png" alt="Hero Illustration">
          </div>
          <div class="w-full max-w-sm mx-auto bg-white shadow-md rounded-lg overflow-hidden">
            <div class="px-6 py-4">
              <form @submit.prevent="login">
                <div class="mb-4">
                  <label for="NIP" class="block text-gray-700 text-lg font-bold mb-2">NIP</label>
                  <input
                    type="text"
                    id="NIP"
                    placeholder="Masukkan NIP"
                    class="block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
                    v-model="NIP"
                  />
                </div>
                <div class="mb-6">
                  <label for="password" class="block text-gray-700 text-lg font-bold mb-2">Password</label>
                  <input
                    type="password"
                    id="password"
                    placeholder="Masukkan Password"
                    class="block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
                    v-model="password"
                  />
                </div>
                <div class="text-center">
                  <button type="submit" class="bg-gray-300 text-black font-bold py-2 px-4 rounded-lg w-48">MASUK</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      NIP: "",
      password: "",
    };
  },
  methods: {
    login() {
      // Logika autentikasi login disini
      console.log("NIP:", this.NIP);
      console.log("Password:", this.password);
      // Contoh: Anda dapat menambahkan logika autentikasi ke backend di sini
    },
  },
};
</script>

<style scoped>
.bg-blue {
  @apply bg-blue-600;
}
</style>
