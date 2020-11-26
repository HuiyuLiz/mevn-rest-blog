<template>
  <div class="pt-5 pb-5">
    <div class="container">
      <div class="row">
        <div class="col-lg-8 mx-auto">
          <h3 class="text-dark h4 mb-3">{{ loginStatus }}</h3>
          <p>If you are the member already, please log in.</p>
          <LoginForm :message="message" :isOnSubmit="isOnSubmit" @switch-mode="switchMode" @on-submit="onSubmit"></LoginForm>
          <!-- <Form
            :validation-schema="schema"
            @submit="onSubmit"
          >
            <div class="form-group" v-if="!isLogin">
              <label for="name">User name</label>
              <Field
                name="name"
                type="text"
                class="form-control"
                placeholder="your name"
                v-model="name"
              ></Field>
              <small
                ><error-message
                  name="name"
                  class="form-text text-danger"
                ></error-message
              ></small>
            </div>
            <div class="form-group">
              <label for="email">Email address</label>
              <Field
                name="email"
                type="email"
                class="form-control"
                placeholder="your E-mail"
                v-model="email"
              ></Field>
              <small
                ><error-message
                  name="email"
                  class="form-text text-danger"
                ></error-message
              ></small>
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <Field
                name="password"
                type="password"
                class="form-control"
                placeholder="your password"
                v-model="password"
              ></Field>
              <small
                ><error-message
                  name="password"
                  class="form-text text-danger"
                ></error-message
              ></small>
            </div>
            <div class="d-flex flex-column flex-md-row">
              <button type="submit" class="btn btn-dark mb-3 mb-md-0" :class="{'disabled':isOnSubmit}">
                {{ buttonModeStatus }}
              </button>
              <button
                type="button"
                class="btn btn-outline-dark ml-md-3"
                :class="{'disabled':isOnSubmit}"
                @click="switchMode"
              >
                {{ buttonSwitchStatus }}
              </button>
            </div>
          </Form> -->
          <p class="mt-3" :class="messageClass">{{ message }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LoginForm from '@/components/Login/LoginForm.vue'
export default {
  data () {
    return {
      isLogin: false,
      isOnSubmit: false,
      message: '',
      messageStatus: false
    }
  },
  watch: {
    isLogin (value) {
      if (value) {
        this.message = ''
      }
    }
  },
  components: {
    LoginForm
  },
  computed: {
    loginStatus () {
      if (this.isLogin) {
        return 'Login'
      } else {
        return 'Sign Up'
      }
    },
    messageClass () {
      if (!this.messageStatus) {
        return 'text-danger'
      } else {
        return 'text-success'
      }
    }
  },
  methods: {
    switchMode (value) {
      this.isLogin = value
    },
    onSubmit (values) {
      this.isOnSubmit = true
      if (values) {
        this.$http
          .put(`${process.env.VUE_APP_API_URL}/auth/signup`, {
            name: values.name,
            email: values.email,
            password: values.password
          })
          .then((response) => {
            if (response.status === 422) {
              throw new Error('Validation failed.')
            }
            if (response.status !== 200 && response.status !== 201) {
              throw new Error('Creating a user failed.')
            }
            this.message = response.data.message
            this.messageStatus = true
            this.isOnSubmit = false
            console.log(response)
          })
          .catch((error) => {
            this.messageStatus = false
            if (error.response.status === 422) {
              this.message = error.response.data.errors[0].msg
            } else {
              this.message = error
            }
            this.isOnSubmit = false
          })
      }
    }
  }
}
</script>
