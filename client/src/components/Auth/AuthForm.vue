<template>
  <div>
    <Form :validation-schema="schema" @submit="onSubmit" id="form" :class="{'fade-in':isFadeIn}">
      <div class="form-group" v-if="!isAuth">
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
          {{ submitButtonContent }}
        </button>
        <button
          type="button"
          class="btn btn-outline-dark ml-md-3"
          :class="{ disabled: isOnSubmit }"
          @click="switchAuthMode"
        >
          {{ switchModeButtonContent }}
        </button>
      </div>
    </Form>
  </div>
</template>

<script>
import { Form, Field, ErrorMessage } from 'vee-validate'
import * as yup from 'yup'
export default {
  emits: ['on-submit', 'switch-mode', 'composition-typing'],
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
      isAuth: false,
      isFadeIn: false,
      schema: yup.object().shape({
        name: yup.string().required(),
        email: yup.string().email().required(),
        password: yup.string().min(8).required()
      })
    }
  },
  computed: {
    submitButtonContent () {
      if (this.isAuth) {
        return 'Login'
      } else {
        return 'Sign Up'
      }
    },
    switchModeButtonContent () {
      if (this.isAuth) {
        return 'Sign Up Instead'
      } else {
        return 'Login Instead'
      }
    }
  },
  watch: {
    isAuth (newValue, oldValue) {
      if (newValue !== oldValue) {
        this.isFadeIn = true
        setTimeout(() => {
          this.isFadeIn = false
        }, 1000)
      }
    },
    message (newValue, oldValue) {
      // if (newValue !== oldValue) {
      //   this.clearInputs()
      // }
      // setTimeout(() => {
      //   this.formReset()
      // }, 200)
    }
  },
  methods: {
    onSubmit (values, event) {
      this.$emit('on-submit', values)
    },
    switchAuthMode () {
      this.isAuth = !this.isAuth
      this.$emit('switch-mode', this.isAuth)
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

<style scoped>
  .fade-in{
    animation: fadeIn .3s ease-in;
  }
  @keyframes fadeIn{
    0%{
      opacity:0;
    }
    100%{
      opacity:1;
    }
  }
</style>
