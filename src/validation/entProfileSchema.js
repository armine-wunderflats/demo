import * as Yup from "yup";
import i18n from "../i18n";
import "./validators";

const entProfileSchema = Yup.object().shape({
  bio: Yup.string().
    trim().
    required(i18n.t("validator.bio_required")),
  location: Yup.string()
    .trim()
    .required(i18n.t("validator.location_required")),
  availableVia: Yup.string()
    .trim()
    .required(i18n.t("validator.availableVia_rquired"))
});

export default entProfileSchema;