import { IonButton, IonInput, useIonToast } from "@ionic/react";
import { useFormik } from "formik";
import classes from "../page.module.css";
import { User, useUserStore } from "../../../store/user.store";
import { backspace } from "ionicons/icons";
import { useLanguageStore } from "../../../store/language.store";

const ProfileContentForm = () => {
  const setUser = useUserStore((state) => state.setUser);
  const user = useUserStore((state) => state.user);
  const languageState = useLanguageStore((state) => state.state);

  const t = languageState.pages.profile;

  const [present] = useIonToast();

  const formik = useFormik<User>({
    initialValues: user || { email: "", name: "", photoUrl: "" },
    onSubmit: (values, { resetForm }) => {
      try {
        setUser(values);
        resetForm({ values: values });

        present({
          message: t.save_success,
          duration: 2000,
          color: "success",
        });
      } catch (error) {
        console.log(error, "error");
        present({
          message: t.save_error,
          duration: 2000,
          color: "danger",
        });
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className={classes.form}>
      <IonInput
        name="name"
        onChange={formik.handleChange}
        value={formik.values.name}
        placeholder={t.name_placeholder}
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
        placeholder={t.email_placeholder}
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
        placeholder={t.photo_url_placeholder}
        debounce={300}
        type="url"
        clearInput
        clearInputIcon={backspace}
      />

      <IonButton type="submit" color="success" disabled={!formik.dirty}>
        {t.save}
      </IonButton>
    </form>
  );
};

export default ProfileContentForm;
