import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, ActivityIndicator, SafeAreaView, Switch } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';


const validationSchema = yup.object().shape({
  email: yup
  .string()
  .label('Email')
  .email()
  .required(),
  password: yup
  .string()
  .label('Password')
  .required()
  .min(2, 'Seems a bit short')
  .max(10, 'Try shorter password'),
  agreeToTerms: yup.boolean().label('Terms').test('is-true', 'Must agree to terms to continue', value => value === true),
  confirmPassword: yup
  .string()
  .required()
  .label('Confirm Password')
  .test("password-match", "Password must match ya fool", function(value) {
    return this.parent.password === value;
  })
});


const FieldWrapper = ({ children, label, formikProps, formikKey }) => (
  <View style={{ marginHorizontal: 20, marginVertical: 3}}>
      <Text style={{ marginBottom: 3 }}>{label}</Text>
      {children}  
      <Text style={{ color: 'red' }}>
        {formikProps.touched[formikKey] && formikProps.errors[formikKey]}
      </Text>
    </View>
)

const StyledInput = ({ label, formikProps, formikKey, ...rest }) => {
  const inputStyles = {
    borderWidth: 1, 
    borderColor: '#909090', 
    padding: 10,
    marginBottom: 3
  }

  if(formikProps.touched[formikKey] && formikProps.errors[formikKey]) {
    inputStyles.borderColor = "red";
  }

  return (
    <FieldWrapper
      formikProps={formikProps}
      formikKey={formikKey}
      label={label}
    >
      <TextInput 
        style={inputStyles}
        onChangeText={formikProps.handleChange(formikKey)}
        onBlur={formikProps.handleBlur(formikKey)}
        {...rest}
      />
    </FieldWrapper>
  )
}

const StyledSwitch = ({ formikKey, formikProps, label, ...rest }) => {
  return (
    <FieldWrapper
      formikProps={formikProps}
      formikKey={formikKey}
      label={label}
    >
      <Switch
        value={formikProps.values[formikKey]}
        onValueChange={value => {
          formikProps.setFieldValue(formikKey, value);
        }}
        {...rest}
      />
    </FieldWrapper>
  )
};

const signUp = ({ email }) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email === 'A@a.com') {
        reject(new Error("You playin' with that fake email address."));
      }
      resolve(true);
    }, 1000);
  });
  

export default class App extends React.Component {

  render() {
    return (
      <SafeAreaView style={{ marginTop: 90 }}>
        <Formik
          initialValues={{ email: '', password: '', agreeToTerms: false, confirmPassword: '' }}
          onSubmit={(values, actions) => {
            signUp({ email: values.email })
            .then(() => {
              alert(JSON.stringify(values));
            })
            .catch(error => {
              actions.setFieldError('general', error.message);
            })
            .finally(() => {
              actions.setSubmitting(false);
            });
          }}
          validationSchema={validationSchema}
        >
          {formikProps => (
            <React.Fragment>
              <StyledInput
                label={'Email'}
                formikProps={formikProps}
                formikKey="email"
                placeholder="john@gmail.com"
              />
              <StyledInput
                label={'Password'}
                formikProps={formikProps}
                formikKey="password"
                secureTextEntry
              />
              <StyledInput
                label={'Confirm Password'}
                formikProps={formikProps}
                formikKey="confirmPassword"
                secureTextEntry
              />
              <StyledSwitch
                label="Agree to terms"
                formikKey="agreeToTerms"
                formikProps={formikProps}
              />
              {formikProps.isSubmitting ? (
                <ActivityIndicator />)
                : (
                  <React.Fragment>
                    <Button title="Submit" onPress={formikProps.handleSubmit} />
                    <Text style={{ color: 'red' }}>{formikProps.errors.general}</Text>
                  </React.Fragment>
                )
              }
            </React.Fragment>

          )}
        </Formik>
        
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
