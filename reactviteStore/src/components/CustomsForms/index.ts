// composable (validation enabled for field displayed) headless (prebuilt components)
// custom fields with hooks

import { useReducer } from "react";

// component pattern
// hook based state management
// controlled field pattern
// state machine 

// higher order component

// declarative form configuration

// useForms hook initValues, onSubmit, onChange, validation, reset

// selector pattern
// vars: fieldname, props: interface 
// hook creation including useEffect, useState return object {value, error, setValue, isValid, isTouched isDirty} facade pattern
// main react ContextAPI in Form for initialValues - useState - ref 

// factory pattern closure reuse

// register fields in a map initialValues




const formMiddleware = (dispatch) => (next) => async (action: any) => {


}

function setValues(){
    return 
}

// composant 
// const [state, dispatch] = useReducer(reducer, { age: 42 });
// function reducer(state: any, action: any) {
//     switch (action.type) {
//         switch (typedAction.type) {
//              case actionTypes.USER_LOGIN_REQUEST:
//                try {
//                  dispatch({
//                    type: actionTypes.USER_LOGIN_LOADING,
//                  });
//                  const resp = await requests.userLogin(typedAction.payload);
//                  dispatch({
//                    type: actionTypes.USER_LOGIN_SUCCESS,
//                    payload: resp.data.data,
//                  });
//                } catch (error: unknown) {
//                  dispatch({
//                    type: actionTypes.USER_LOGIN_FAILURE,
//                    payload: error,
//                  });
//                }
//                break;
//         default:
//             return {} // reset initialValues
//   }
// }

function reducer(state: any, action: any) {
    switch (action.type) {
        case "changed_name":{
            return {
                name: state.name,
                age: state.age + 1
            };
            }
          
        default:
            return {} // reset initialValues
  }
}



const Index = () => {

    const [state, dispatch] = useReducer(reducer, { age: 42 });


    function handleSubmit() {
        dispatch({ type: 'submit_form' });
    }

    function handleInputChange(e: any) {
    dispatch({
      type: 'changed_name',
      nextName: e.target.value
    });
  }



    return (

    )

}

export default Index


                                                                                          