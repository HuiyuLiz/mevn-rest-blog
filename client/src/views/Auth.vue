<template>
  <div class="pt-5 pb-5">
    <div class="container">
      <div class="row">
        <div class="col-lg-8 mx-auto">
          <h3 class="text-dark h4 mb-3">{{ loginStatus }}</h3>
          <p>If you are the member already, please log in.</p>
          <AuthForm
            :message="message"
            :isOnSubmit="isOnSubmit"
            @switch-mode="switchMode"
            @on-submit="onSubmit"
            >
          </AuthForm>
          <p class="mt-3" :class="messageClass">{{ message }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AuthForm from '@/components/Auth/AuthForm.vue'
export default {
  data () {
    return {
      isAuth: false,
      isOnSubmit: false,
      message: '',
      messageSuccess: false,
      timer: null
    }
  },
  watch: {
    isAuth (value) {
      if (value) {
        this.message = ''
      }
    }
  },
  components: {
    AuthForm
  },
  computed: {
    isLoading () {
      return this.$store.getters.isLoading
    },
    loginStatus () {
      if (this.isAuth) {
        return 'Login'
      } else {
        return 'Sign Up'
      }
    },
    messageClass () {
      if (!this.messageSuccess) {
        return 'text-danger'
      } else {
        return 'text-success'
      }
    },
    responseMessage () {
      return this.$store.getters['auth/message']
    }
  },
  methods: {
    clearMessage () {
      if (this.message !== '') {
        this.message = ''
      }
    },
    clearTimeOut () {
      clearTimeout(this.timer)
    },
    setTimer () {
      this.timer = setTimeout(() => {
        this.clearMessage()
      }, 3500)
    },
    switchMode (value) {
      this.isAuth = value
    },
    async onSubmit (values) {
      if (!values) return
      this.isOnSubmit = true
      this.clearTimeOut()
      this.$store.commit('changeLoading', true)
      try {
        if (!this.isAuth) {
          await this.$store.dispatch('auth/SIGNUP', {
            name: values.name,
            email: values.email,
            password: values.password
          })
        } else {
          await this.$store.dispatch('auth/LOGIN', {
            email: values.email,
            password: values.password
          })

          setTimeout(() => {
            this.$router.replace({ name: 'Dashboard', query: { page: 1 } })
          }, 500)
        }
        this.message = this.responseMessage
        this.messageSuccess = true
        this.isOnSubmit = false
      } catch (error) {
        const errorMessage = 'Failed to authenticate, try later.'
        if (error.response.data && error.response.data.errors !== null) {
          this.message = error.response.data?.errors ? error.response.data.errors[0].msg : errorMessage
        } else if (error.response.data && error.response.data.message) {
          this.message = error.response.data.message ? error.response.data.message : errorMessage
        } else {
          this.message = errorMessage
        }
        this.messageSuccess = false
        this.isOnSubmit = false
      }
      this.setTimer()
      this.$store.commit('changeLoading', false)
    }
  }
}
</script>
