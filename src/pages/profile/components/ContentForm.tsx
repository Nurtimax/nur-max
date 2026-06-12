import { IonButton, IonInput, useIonToast } from "@ionic/react";
import { useFormik } from "formik";
import classes from "../page.module.css";
import { User, useUserStore } from "../../../store/user.store";
import { backspace } from "ionicons/icons";

const ProfileContentForm = () => {
  const setUser = useUserStore((state) => state.setUser);
  const user = useUserStore((state) => state.user);

  const [present] = useIonToast();

  const formik = useFormik<User>({
    initialValues: user || { email: "", name: "", photoUrl: "" },
    onSubmit: (values, { resetForm }) => {
      setUser(values);
      resetForm({ values: values });

      present({
        message: "Профиль успешно сохранен",
        duration: 2000,
        color: "success",
      });
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className={classes.form}>
      <IonInput
        name="name"
        onChange={formik.handleChange}
        value={formik.values.name}
        placeholder="Name"
        onIonChange={formik.handleChange}
        debounce={300}
        type="text"
        clearInput
        clearInputIcon={backspace}
      />
      <IonInput
        name="email"
        onChange={formik.handleChange}
        value={formik.values.email}
        placeholder="Email"
        debounce={300}
        onIonChange={formik.handleChange}
        type="email"
        clearInput
        clearInputIcon={backspace}
      />
      <IonInput
        name="photoUrl"
        onChange={formik.handleChange}
        value={formik.values.photoUrl}
        onIonChange={formik.handleChange}
        placeholder="Photo URL"
        debounce={300}
        type="url"
        clearInput
        clearInputIcon={backspace}
      />

      <IonButton type="submit" color="success" disabled={!formik.dirty}>
        Сохранить
      </IonButton>
    </form>
  );
};

export default ProfileContentForm;
