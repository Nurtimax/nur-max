import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonIcon,
  IonRow,
} from "@ionic/react";
import { MealDay } from "../../../@types/meal.types";
import { FC } from "react";
import {
  leafOutline,
  moonOutline,
  restaurantOutline,
  sunnyOutline,
} from "ionicons/icons";

interface IProps {
  data: MealDay;
}
const MealCard: FC<IProps> = ({ data }) => {
  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>{data.day}-күн</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <IonRow>
          <IonCol size="12" sizeMd="6">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "12px",
              }}
            >
              <IonIcon icon={sunnyOutline} color="warning" />
              <div>
                <strong>🍳 Эртең менен</strong>
                <p style={{ margin: 0 }}>{data.breakfast}</p>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "12px",
              }}
            >
              <IonIcon icon={restaurantOutline} color="primary" />
              <div>
                <strong>🍲 Түштө (обед)</strong>
                <p style={{ margin: 0 }}>{data.lunch}</p>
              </div>
            </div>
          </IonCol>

          <IonCol size="12" sizeMd="6">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "12px",
              }}
            >
              <IonIcon icon={moonOutline} color="dark" />
              <div>
                <strong>🥗 Кечки</strong>
                <p style={{ margin: 0 }}>{data.dinner}</p>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <IonIcon icon={leafOutline} color="success" />
              <div>
                <strong>🍎 Жемиш</strong>
                <p style={{ margin: 0 }}>{data.fruit}</p>
              </div>
            </div>
          </IonCol>
        </IonRow>
      </IonCardContent>
    </IonCard>
  );
};

export default MealCard;
