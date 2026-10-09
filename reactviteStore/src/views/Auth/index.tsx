import { connect } from "react-redux";
import { Formiz, useForm } from "@formiz/core";
import { isRequired } from "@formiz/validations";
import * as selectors from "../../stores/rootSelectors";
import * as actions from "../../stores/rootActions";
import type { AppDispatch, RootState } from "../../stores";
import { RVInput, LoadingButton, Meta } from "../../components";
import { BthForm, Container, Form, LoginForm, Message } from "../../components/Layout/styles";
import type { User } from "../../stores/user/interfaces";

const Index = ({ dispatch }: UserProps) => {
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    } as User,
    onSubmit: (values) => {
      handleSubmitLogin(values);
      form.reset();
    },
  });

  const handleSubmitLogin = (values: User) => {
    dispatch(
      actions.auth.userLogin({
        query: {
          email: values.email,
          password: values.password,
        },
      }),
    );
  };

  const meta = {
    title: "Login",
    description: "Login page",
    url: `/login`,
  };

  return (
    <>
      <Meta metaData={meta} />
      <Container>
        <LoginForm>
          <Message>Nodejs v24.7.0 - argon2Async salt + env secret</Message>
          <Message>
            <strong>user:</strong> hash3@mail.com, <strong>password:</strong> password3
          </Message>
          <Message>
            Cookies are valid for 1 week. Upon expiration, the user token is removed from the
            MongoDB token table.
          </Message>
          <Formiz connect={form}>
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                form.submit();
              }}
            >
              <RVInput
                name="email"
                type="text"
                id="1"
                label="Email"
                required="Email is required"
                validations={[
                  {
                    handler: isRequired(),
                    message: "Email is required",
                  },
                ]}
              />
              <RVInput
                name="password"
                type="text"
                id="2"
                label="Password"
                required="Password is required"
                validations={[
                  {
                    handler: isRequired(),
                    message: "Password is required",
                  },
                ]}
              />
              <BthForm>
                <LoadingButton type="submit" content="Submit" loading={form.isValidating} />
              </BthForm>
            </Form>
          </Formiz>
        </LoginForm>
      </Container>
    </>
  );
};

const mapStateToProps = (state: RootState) => {
  return {
    authLoading: selectors.auth.authLoadingSelector(state),
  };
};

interface UserProps {
  authLoading: boolean;
  dispatch: AppDispatch;
}

export default connect(mapStateToProps)(Index);
