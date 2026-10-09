Compound Component Pattern
small components susing context

hook based state managment
reactjs hook pattern => ease to reuse hooks ciated functions.

fields controlled global state
centralize fields: {name, type, validation}

state machine => step-based ui
validation per steps

ui
higher order components (wrapper) Encapsulation pattern

UI layer → Inputs, layout
Logic layer → hooks (useForm, useField)
Validation layer → schema (Yup, Zod, etc.)

const [FormContextProvider, useFormStore] = createcontext(store)

export const form = ({childern, connect, autoForm}) => {

    const actions = storeActions()
    const formId = id
     const unconnectedTimeoutRef = useRef<NodeJS.Timeout>();

     return(<FormContextProvier>autoForm ? (
        <form></form> : children
     )</FormContextProvier>)

}
