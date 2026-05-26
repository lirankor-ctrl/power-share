import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';

const userTypes = [
  { value: 'seeker', label: 'מחפש טעינה בלבד' },
  { value: 'owner', label: 'מציע עמדה בלבד' },
  { value: 'both', label: 'גם מחפש וגם מציע עמדה' }
];

// Israeli phone: lenient — allow digits, spaces, dashes, parens, optional + and country code.
// After stripping, accept 9–13 digits (covers 0501234567, 972501234567, +972-50-123-4567 etc.)
function validatePhone(value) {
  const v = value.trim();
  if (!v) return 'יש להזין מספר טלפון';
  const digits = v.replace(/\D/g, '');
  if (digits.length < 9 || digits.length > 13) return 'מספר טלפון לא תקין';
  return null;
}

function validateEmail(value) {
  const v = value.trim();
  if (!v) return 'יש להזין כתובת דוא״ל';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return 'כתובת דוא״ל לא תקינה';
  return null;
}

function required(value, msg = 'שדה חובה') {
  return value.trim() ? null : msg;
}

export default function Onboarding() {
  const navigate = useNavigate();
  const { setUser } = useApp();
  const [step, setStep] = useState(0);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    photo: '',
    phone: '',
    email: '',
    userType: 'seeker',
    chargerAddress: '',
    chargerCity: '',
    chargerHours: '',
    chargerDescription: '',
    chargerNotes: ''
  });

  const [touched, setTouched] = useState({});
  const [submitTried, setSubmitTried] = useState(false);

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const markTouched = (k) => setTouched((t) => ({ ...t, [k]: true }));

  const isOwner = form.userType === 'owner' || form.userType === 'both';

  const errors = useMemo(() => {
    const e = {};
    const fn = required(form.firstName); if (fn) e.firstName = fn;
    const ln = required(form.lastName); if (ln) e.lastName = ln;
    const ph = validatePhone(form.phone); if (ph) e.phone = ph;
    const em = validateEmail(form.email); if (em) e.email = em;
    if (isOwner) {
      const a = required(form.chargerAddress); if (a) e.chargerAddress = a;
      const c = required(form.chargerCity); if (c) e.chargerCity = c;
      const h = required(form.chargerHours); if (h) e.chargerHours = h;
    }
    return e;
  }, [form, isOwner]);

  const canSubmit = Object.keys(errors).length === 0;

  const showError = (key) => (touched[key] || submitTried) && errors[key];

  const onPhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => update('photo', reader.result);
    reader.readAsDataURL(file);
  };

  const submit = () => {
    setSubmitTried(true);
    if (!canSubmit) return;
    setUser({
      ...form,
      createdAt: Date.now()
    });
    navigate('/', { replace: true });
  };

  if (step === 0) {
    return (
      <div className="welcome-screen">
        <img src="/logo.jpg" alt="Power Share" className="brand-logo" />
        <p>פלטפורמה לשיתוף עמדות טעינה פרטיות לרכבים חשמליים בישראל</p>
        <button className="btn" onClick={() => setStep(1)}>
          בואו נתחיל
        </button>
      </div>
    );
  }

  const inputCls = (key) => 'field' + (showError(key) ? ' field-invalid' : '');

  return (
    <>
      <header className="page-header">
        <h1>הרשמה לפאוור שייר</h1>
      </header>
      <div className="page">
        <div className="card">
          <h3>פרטים אישיים</h3>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
            <div className="avatar lg">
              {form.photo ? (
                <img src={form.photo} alt="" />
              ) : (
                (form.firstName[0] || '?') + (form.lastName[0] || '')
              )}
            </div>
            <label className="btn btn-secondary" style={{ width: 'auto' }}>
              העלאת תמונה
              <input
                type="file"
                accept="image/*"
                onChange={onPhoto}
                style={{ display: 'none' }}
              />
            </label>
          </div>

          <div className={inputCls('firstName')}>
            <label>שם פרטי</label>
            <input
              value={form.firstName}
              onChange={(e) => update('firstName', e.target.value)}
              onBlur={() => markTouched('firstName')}
              placeholder="לדוגמה: דנה"
            />
            {showError('firstName') && <div className="field-error">{errors.firstName}</div>}
          </div>

          <div className={inputCls('lastName')}>
            <label>שם משפחה</label>
            <input
              value={form.lastName}
              onChange={(e) => update('lastName', e.target.value)}
              onBlur={() => markTouched('lastName')}
              placeholder="לדוגמה: לוי"
            />
            {showError('lastName') && <div className="field-error">{errors.lastName}</div>}
          </div>

          <div className={inputCls('phone')}>
            <label>טלפון נייד</label>
            <input
              type="tel"
              inputMode="tel"
              dir="ltr"
              value={form.phone}
              onChange={(e) => update('phone', e.target.value)}
              onBlur={() => markTouched('phone')}
              placeholder="050-1234567"
            />
            {showError('phone') && <div className="field-error">{errors.phone}</div>}
          </div>

          <div className={inputCls('email')}>
            <label>דוא״ל</label>
            <input
              type="email"
              inputMode="email"
              dir="ltr"
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
              onBlur={() => markTouched('email')}
              placeholder="name@example.com"
              autoCapitalize="off"
              autoCorrect="off"
            />
            {showError('email') && <div className="field-error">{errors.email}</div>}
          </div>
        </div>

        <div className="card">
          <h3>סוג משתמש</h3>
          <div className="user-type-group">
            {userTypes.map((t) => (
              <label
                key={t.value}
                className={'radio-card' + (form.userType === t.value ? ' active' : '')}
              >
                <input
                  type="radio"
                  name="userType"
                  value={t.value}
                  checked={form.userType === t.value}
                  onChange={(e) => update('userType', e.target.value)}
                />
                {t.label}
              </label>
            ))}
          </div>
        </div>

        {isOwner && (
          <div className="card">
            <h3>פרטי העמדה שלך</h3>

            <div className={inputCls('chargerAddress')}>
              <label>כתובת העמדה</label>
              <input
                value={form.chargerAddress}
                onChange={(e) => update('chargerAddress', e.target.value)}
                onBlur={() => markTouched('chargerAddress')}
                placeholder="רחוב ומספר"
              />
              {showError('chargerAddress') && (
                <div className="field-error">{errors.chargerAddress}</div>
              )}
            </div>

            <div className={inputCls('chargerCity')}>
              <label>עיר</label>
              <input
                value={form.chargerCity}
                onChange={(e) => update('chargerCity', e.target.value)}
                onBlur={() => markTouched('chargerCity')}
                placeholder="לדוגמה: תל אביב"
              />
              {showError('chargerCity') && (
                <div className="field-error">{errors.chargerCity}</div>
              )}
            </div>

            <div className={inputCls('chargerHours')}>
              <label>שעות פעילות</label>
              <input
                value={form.chargerHours}
                onChange={(e) => update('chargerHours', e.target.value)}
                onBlur={() => markTouched('chargerHours')}
                placeholder="08:00 - 22:00"
              />
              {showError('chargerHours') && (
                <div className="field-error">{errors.chargerHours}</div>
              )}
            </div>

            <div className="field">
              <label>תיאור קצר של העמדה (לא חובה)</label>
              <textarea
                value={form.chargerDescription}
                onChange={(e) => update('chargerDescription', e.target.value)}
                placeholder="לדוגמה: עמדה ביתית Type 2, חניה בחצר פרטית"
              />
            </div>

            <div className="field">
              <label>הערות נוספות (לא חובה)</label>
              <textarea
                value={form.chargerNotes}
                onChange={(e) => update('chargerNotes', e.target.value)}
                placeholder="הוראות חניה, קוד שער, סוג כבל..."
              />
            </div>
          </div>
        )}

        {submitTried && !canSubmit && (
          <div className="form-summary-error">
            יש למלא את כל שדות החובה לפני סיום ההרשמה
          </div>
        )}

        <button className="btn" disabled={!canSubmit} onClick={submit}>
          סיום הרשמה
        </button>
      </div>
    </>
  );
}
