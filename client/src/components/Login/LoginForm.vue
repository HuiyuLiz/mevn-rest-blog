<template>
  <div>
    <Form :validation-schema="schema" @submit="onSubmit" id="form">
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
        <button
          type="submit"
          class="btn btn-dark mb-3 mb-md-0"
          :class="{ disabled: isOnSubmit }"
        >
          {{ buttonModeStatus }}
        </button>
        <button
          type="button"
          class="btn btn-outline-dark ml-md-3"
          :class="{ disabled: isOnSubmit }"
          @click="switchMode"
        >
          {{ buttonSwitchStatus }}
        </button>
      </div>
    </Form>
  </div>
</template>

<script>
import { Form, Field, ErrorMessage } from 'vee-validate'
import * as yup from 'yup'
export default {
  emits: ['on-submit', 'switch-mode'],
  props: {
    isOnSubmit: {
      type: Boolean,
      required: true
    },
    message: {
      type: String,
      required: true
    }
  },
  components: {
    Form,
    Field,
    ErrorMessage
  },
  data () {
    return {
      name: '',
      email: '',
      password: '',
      isLogin: false,
      schema: yup.object().shape({
        name: yup.string().required(),
        email: yup.string().email().required(),
        password: yup.string().min(8).required()
      })
    }
  },
  computed: {
    buttonModeStatus () {
      if (this.isLogin) {
        return 'Login'
      } else {
        return 'Sign Up'
      }
    },
    buttonSwitchStatus () {
      if (this.isLogin) {
        return 'Sign Up Instead'
      } else {
        return 'Login Instead'
      }
    }
  },
  watch: {
    message (newValue, oldValue) {
      if (newValue !== oldValue) {
        this.clearInputs()
      }
      setTimeout(() => {
        this.formReset()
      }, 200)
    }
  },
  methods: {
    onSubmit (values, event) {
      this.$emit('on-submit', values)
    },
    switchMode () {
      this.isLogin = !this.isLogin
      this.$emit('switch-mode', this.isLogin)
      this.clearInputs()
      setTimeout(() => {
        this.formReset()
      }, 0)
    },
    formReset (e) {
      document.getElementById('form').reset()
    },
    clearInputs () {
      this.name = ''
      this.email = ''
      this.password = ''
    }
  }
}
</script>

<style>
</style>
