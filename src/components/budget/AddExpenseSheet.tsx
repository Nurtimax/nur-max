import { IonIcon, IonModal, IonInput, IonButton } from "@ionic/react";
import { closeOutline } from "ionicons/icons";
import { FC, useEffect, useRef, useState } from "react";
import { ExpenseCategory } from "../../@types/budget.types";
import { useBudgetStore } from "../../store/budget.store";
import { useExpenseSheet } from "../../store/expense-sheet.store";
import { useLanguageStore } from "../../store/language.store";
import {
  getExpenseCategories,
  QUICK_AMOUNTS,
} from "../../utils/constants/budget.constant";
import { dateKeyForDay, formatMoney } from "../../utils/helpers/budget.helper";
import { haptic, hapticSuccess } from "../../utils/helpers/telegram.helper";
import { getDateLabel } from "../../utils/constants/language/index.constant";
import classes from "./index.module.css";

/** Чыгым кошуу терезеси — колдонмодо бир жолу гана чакырылат */
const AddExpenseSheet: FC = () => {
  const modal = useRef<HTMLIonModalElement>(null);

  const isOpen = useExpenseSheet((state) => state.isOpen);
  const defaultCategory = useExpenseSheet((state) => state.category);
  const day = useExpenseSheet((state) => state.day);
  const defaultAmount = useExpenseSheet((state) => state.amount);
  const close = useExpenseSheet((state) => state.close);

  const addExpense = useBudgetStore((state) => state.addExpense);

  const language = useLanguageStore((state) => state.language);
  const languageState = useLanguageStore((state) => state.state);
  const t = languageState.pages.budget;
  const currency = languageState.common.currency;

  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [category, setCategory] = useState<ExpenseCategory>(defaultCategory);

  // Терезе ачылганда формасын тазалайбыз
  useEffect(() => {
    if (isOpen) {
      setAmount(defaultAmount ? `${defaultAmount}` : "");
      setNote("");
      setCategory(defaultCategory);
    }
  }, [isOpen, defaultCategory, defaultAmount]);

  const value = Number(amount.replace(",", "."));
  const isValid = Number.isFinite(value) && value > 0;

  const handleSave = () => {
    if (!isValid) return;

    addExpense({
      amount: value,
      category,
      note,
      date: day ? dateKeyForDay(day) : undefined,
    });
    hapticSuccess();
    close();
  };

  const addQuick = (quick: number) => {
    haptic("light");
    // Тез басууда да сумма туура кошулушу үчүн — мурунку маанинин үстүнө
    setAmount((prev) => `${(Number(prev.replace(",", ".")) || 0) + quick}`);
  };

  return (
    <IonModal
      ref={modal}
      isOpen={isOpen}
      onDidDismiss={close}
      initialBreakpoint={0.85}
      breakpoints={[0, 0.85, 1]}
      handle
      className={classes.sheet}
    >
      <div className={classes.sheetBody}>
        <header className={classes.sheetHead}>
          <div>
            <h2 className={classes.sheetTitle}>{t.add}</h2>
            <p className={classes.sheetSubtitle}>
              {day ? getDateLabel(day, language) : t.today}
            </p>
          </div>
          <button
            type="button"
            className={classes.sheetClose}
            onClick={close}
            aria-label={t.delete}
          >
            <IonIcon icon={closeOutline} />
          </button>
        </header>

        <div className={classes.amountBox}>
          <IonInput
            className={classes.amountInput}
            type="number"
            inputmode="decimal"
            value={amount}
            placeholder={t.amount_placeholder}
            onIonInput={(e) => setAmount(e.detail.value ?? "")}
          />
          <span className={classes.amountCurrency}>{currency}</span>
        </div>

        <div className={classes.quickRow}>
          {QUICK_AMOUNTS.map((quick) => (
            <button
              key={quick}
              type="button"
              className={classes.quickChip}
              onClick={() => addQuick(quick)}
            >
              +{quick}
            </button>
          ))}
        </div>

        <p className={classes.fieldLabel}>{t.category}</p>
        <div className={classes.categoryGrid}>
          {getExpenseCategories(languageState).map((item) => (
            <button
              key={item.key}
              type="button"
              className={`${classes.categoryChip} ${
                category === item.key ? classes.categoryChipActive : ""
              }`}
              style={{ ["--cat-accent" as string]: item.accent }}
              onClick={() => {
                haptic("light");
                setCategory(item.key);
              }}
            >
              <IonIcon icon={item.icon} />
              <span>{item.title}</span>
            </button>
          ))}
        </div>

        <p className={classes.fieldLabel}>{t.note}</p>
        <IonInput
          className={classes.noteInput}
          value={note}
          placeholder={t.note_placeholder}
          onIonInput={(e) => setNote(e.detail.value ?? "")}
        />

        <IonButton
          expand="block"
          disabled={!isValid}
          onClick={handleSave}
          className={`${classes.saveButton} ${!isValid ? classes.buttonDisabled : ""}`}
        >
          {isValid ? `${t.save} · ${formatMoney(value, currency)}` : t.save}
        </IonButton>
      </div>
    </IonModal>
  );
};

export default AddExpenseSheet;
