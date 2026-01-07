import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonTitle,
  IonToolbar,
} from "@ionic/react";

interface InstructionModalProps {
  instructions: string[];
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const InstructionModal: React.FC<InstructionModalProps> = ({
  instructions,
  isOpen,
  setIsOpen,
}) => {
  return (
    <IonModal isOpen={isOpen}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Instruction</IonTitle>
          <IonButtons slot="end">
            <IonButton
              color={"primary"}
              onClick={() => {
                setIsOpen(false);
              }}
            >
              Close
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div>
          <IonCard>
            <IonCardContent>
              <IonList>
                {instructions.map((instruction, index) => (
                  <IonItem key={index}>
                    <IonLabel>{instruction}</IonLabel>
                  </IonItem>
                ))}
              </IonList>
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonModal>
  );
};

export default InstructionModal;
