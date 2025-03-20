import { useState, useRef, useEffect, useCallback } from 'react';
import { useSnapshot } from 'valtio';
import store from '../../../appStore';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';
import AnimatedLetter from '../../UI/common/ui-utils/AnimatedLetter';

interface FormData {
  email: string;
  reason: string;
  message: string;
  legalConsent: boolean;
}

interface FormErrors {
  email?: string;
  reason?: string;
  message?: string;
  legalConsent?: string;
}

interface MessagePrompt {
  text: string;
  minLength: number;
}

const ContactForm = () => {
  const snap = useSnapshot(store);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currentLanguage } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    'idle' | 'success' | 'error'
  >('idle');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isActive, setIsActive] = useState(false);

  const messagePrompts = t('contactForm.messagePrompts', {
    returnObjects: true,
  }) as MessagePrompt[];

  const [formData, setFormData] = useState<FormData>(() => {
    // Initialize form data from localStorage if available
    const savedData = localStorage.getItem('contactFormData');
    return savedData
      ? JSON.parse(savedData)
      : {
          email: '',
          reason: '',
          message: '',
          legalConsent: false,
        };
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isFormValid, setIsFormValid] = useState(false);

  // Add validateField function before the effect that uses it
  const validateField = useCallback(
    (name: keyof FormData, value: string | boolean): string | undefined => {
      switch (name) {
        case 'email': {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!value.toString().trim()) return 'Email is required';
          if (!emailRegex.test(value.toString())) return 'Email is not valid';
          break;
        }
        case 'reason': {
          if (!value) return 'Please select a reason';
          break;
        }
        case 'message': {
          if (!value.toString().trim()) return 'Message is required';
          if (value.toString().length < 14)
            return 'Message must be at least 14 characters';
          break;
        }
        case 'legalConsent': {
          if (!value) return 'You must accept the terms and conditions';
          break;
        }
      }
      return undefined;
    },
    []
  );

  // Reset form validation when form is opened
  useEffect(() => {
    if (snap.contactFormExpanded) {
      // Validate form when reopening
      const isValid = Object.keys(formData).every(
        (key) =>
          !validateField(key as keyof FormData, formData[key as keyof FormData])
      );
      setIsFormValid(isValid);
    }
  }, [snap.contactFormExpanded, formData, validateField]);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('contactFormData', JSON.stringify(formData));
  }, [formData]);

  // Add mouse move handler
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Trigger animation on mount
  useEffect(() => {
    setIsActive(true);
    return () => setIsActive(false);
  }, []);

  const getColoredPrompt = (messageLength: number): JSX.Element => {
    // Find the current prompt based on message length
    const currentPrompt =
      messagePrompts.find((prompt) => {
        return messageLength < prompt.minLength;
      }) || messagePrompts[messagePrompts.length - 1];

    // Find the previous prompt's length to calculate relative position
    const promptIndex = messagePrompts.indexOf(currentPrompt);
    const startLength =
      promptIndex === 0 ? 0 : messagePrompts[promptIndex - 1].minLength;

    // Calculate how many non-space characters should be filled
    const relativeLength = messageLength - startLength;
    let filledCount = 0;

    // Process each character in the prompt
    return (
      <div className="text-[1vw] text-textDark dark:text-textLight uppercase select-none">
        {currentPrompt.text.split('').map((char, index) => {
          if (char === ' ') {
            return (
              <span key={index} className="text-gray-300">
                {' '}
              </span>
            );
          }

          const shouldBeColored = filledCount < relativeLength;
          filledCount++;

          return (
            <span
              key={index}
              style={{ color: shouldBeColored ? snap.selectedColor : 'gray' }}
            >
              {char}
            </span>
          );
        })}
      </div>
    );
  };

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | { target: { name: string; value: string } }
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    // Handle checkbox differently from other inputs
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Only validate reason field on change (keeping select behavior unchanged)
    if (name === 'reason') {
      const fieldError = validateField(name as keyof FormData, value);
      setErrors((prev) => ({ ...prev, [name]: fieldError }));
    }

    // Clear message error if length requirement is met
    if (name === 'message' && value.length >= 14) {
      setErrors((prev) => ({ ...prev, message: undefined }));
    }

    // Reset submit status when user starts typing again
    if (submitStatus !== 'idle') {
      setSubmitStatus('idle');
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Always validate on blur, regardless of value length
    const fieldError = validateField(name as keyof FormData, value);
    setErrors((prev) => ({ ...prev, [name]: fieldError }));

    // Check form validity on blur
    const isValid = Object.keys(formData).every(
      (key) =>
        !validateField(key as keyof FormData, formData[key as keyof FormData])
    );
    setIsFormValid(isValid);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send message');
      }

      setSubmitStatus('success');

      toast.promise(
        new Promise((resolve) => {
          // Clear both form data and localStorage
          setFormData({
            email: '',
            reason: '',
            message: '',
            legalConsent: false,
          });
          localStorage.removeItem('contactFormData');

          setTimeout(() => {
            store.contactFormExpanded = false;
            setSubmitStatus('idle');
            resolve(null);
          }, 2000);
        }),
        {
          loading: 'Sending message...',
          success: 'Message sent successfully!',
          error: 'Failed to send message',
        },
        {
          style: {
            fontSize: '0.9vw',
          },
        }
      );
    } catch (error) {
      setSubmitStatus('error');
      toast.error('Failed to send message. Please try again.');
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validate all fields
    (Object.keys(formData) as Array<keyof FormData>).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    setIsFormValid(isValid);
    return isValid;
  };

  return (
    <div className="px-[1.5vw] w-full h-fit">
      <h2 className="text-textDark dark:text-textLight transition-colors duration-300 text-[4vw] uppercase select-none mb-6">
        {t('contactForm.buttonOpenDialogText')
          .split('')
          .map((char, index) => (
            <AnimatedLetter
              key={index}
              char={char}
              lineIndex={0}
              charIndex={index}
              setHoveredIndex={setHoveredIndex}
              hoveredIndex={hoveredIndex}
              mouseX={mousePosition.x}
              mouseY={mousePosition.y}
              delay={50}
              isActive={isActive}
            />
          ))}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-[1.75vw]">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <FormLabel
              htmlFor="email"
              className={
                errors.email
                  ? 'text-red-500'
                  : 'text-textDark dark:text-textLight'
              }
            >
              {errors.email
                ? errors.email === 'Email is required'
                  ? t('contactForm.email.labelIsRequired')
                  : t('contactForm.email.labelIsNotValid')
                : t('contactForm.email.label')}
            </FormLabel>
            <input
              id="email"
              type="email"
              name="email"
              placeholder={t('contactForm.email.placeholder')}
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`p-[0.75vw] border rounded-xl bg-transparent text-textDark dark:text-textLight text-[1vw] placeholder:text-gray-500 dark:placeholder:text-gray-400 ${
                errors.email
                  ? 'border-red-500'
                  : 'border-gray-700 dark:border-gray-500'
              } focus:outline-none focus:ring-2`}
              style={
                {
                  '--tw-ring-color': snap.selectedColor,
                } as React.CSSProperties
              }
              disabled={isSubmitting}
            />
          </div>

          <div className="flex flex-col">
            <FormLabel
              htmlFor="reason"
              className={
                errors.reason
                  ? 'text-red-500'
                  : 'text-textDark dark:text-textLight'
              }
            >
              {errors.reason
                ? t('contactForm.reason.labelIsRequired')
                : t('contactForm.reason.label')}
            </FormLabel>
            <CustomSelect
              id="reason"
              name="reason"
              value={formData.reason}
              onChange={(value) =>
                handleChange({
                  target: { name: 'reason', value },
                } as React.ChangeEvent<HTMLSelectElement>)
              }
              options={
                t('contactForm.reason.options', {
                  returnObjects: true,
                }) as readonly { value: string; label: string }[]
              }
              error={errors.reason}
              disabled={isSubmitting}
              selectedColor={snap.selectedColor}
            />
          </div>
        </div>

        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-1">
            <FormLabel
              htmlFor="message"
              className={
                errors.message
                  ? 'text-red-500'
                  : 'text-textDark dark:text-textLight'
              }
            >
              {errors.message
                ? errors.message.includes('14 characters')
                  ? t('contactForm.message.labelIsTooShort')
                  : t('contactForm.message.labelIsRequired')
                : t('contactForm.message.label')}
            </FormLabel>
            <div className="text-right">
              {getColoredPrompt(formData.message.length)}
            </div>
          </div>
          <textarea
            id="message"
            name="message"
            placeholder={t('contactForm.message.placeholder')}
            value={formData.message}
            onChange={handleChange}
            onBlur={handleBlur}
            rows={4}
            className={`p-[0.75vw] h-[10vw] border rounded-xl bg-transparent text-textDark dark:text-textLight text-[1vw] placeholder:text-gray-500 dark:placeholder:text-gray-400 ${
              errors.message
                ? 'border-red-500'
                : 'border-gray-700 dark:border-gray-500'
            } focus:outline-none focus:ring-2`}
            style={
              { '--tw-ring-color': snap.selectedColor } as React.CSSProperties
            }
            disabled={isSubmitting}
          />
        </div>

        <div className="flex items-end space-x-3">
          <CustomCheckbox
            id="legalConsent"
            checked={formData.legalConsent}
            onChange={(checked) =>
              handleChange({
                target: {
                  name: 'legalConsent',
                  type: 'checkbox',
                  checked,
                },
              } as React.ChangeEvent<HTMLInputElement>)
            }
            error={errors.legalConsent}
            selectedColor={snap.selectedColor}
            disabled={isSubmitting}
          />
          <div className="flex flex-col">
            <div
              className={`text-[0.9vw] select-none ${
                errors.legalConsent
                  ? 'text-red-500'
                  : 'text-textDark dark:text-textLight'
              } ${isSubmitting ? 'opacity-50' : ''}`}
              dangerouslySetInnerHTML={{
                __html: t('contactForm.legalConsent.text').replace(
                  "class='underline'",
                  `style='color: ${snap.selectedColor}; text-decoration: underline; cursor: pointer;'`
                ),
              }}
              onClick={(e) => {
                const target = e.target as HTMLElement;
                if (target.tagName === 'A') {
                  e.preventDefault();
                  store.contactFormExpanded = false;
                  navigate(`/${currentLanguage}/privacy-policy`);
                }
              }}
            />
            {errors.legalConsent && (
              <span className="text-red-500 text-[0.8vw] mt-1">
                {t('contactForm.legalConsent.error')}
              </span>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !isFormValid}
          className={`uppercase w-full py-2 px-4 rounded-full text-[1.25vw] ${
            isSubmitting || !isFormValid
              ? 'bg-bgLightTransparent dark:bg-bgDarkTransparent cursor-not-allowed text-textDark/50 dark:text-textLight/50'
              : 'text-textDark dark:text-textLight'
          }`}
          style={
            isSubmitting || !isFormValid
              ? undefined
              : { backgroundColor: snap.selectedColor }
          }
        >
          {isSubmitting
            ? t('contactForm.buttonSendTextIsLoading')
            : t('contactForm.buttonSendText')}
        </button>
      </form>
    </div>
  );
};

export default ContactForm;

interface FormLabelProps {
  htmlFor: string;
  children: React.ReactNode;
  className?: string;
}

const FormLabel: React.FC<FormLabelProps> = ({
  htmlFor,
  children,
  className = '',
}) => (
  <label
    htmlFor={htmlFor}
    className={`mb-1 text-[1vw] uppercase select-none ${className}`}
  >
    {children}
  </label>
);

interface CustomSelectProps {
  options: readonly { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  name: string;
  id: string;
  error?: string;
  disabled?: boolean;
  selectedColor: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  onChange,
  // name,
  // id,
  error,
  disabled,
  selectedColor,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption =
    options.find((opt) => opt.value === value) || options[0];

  return (
    <div className="relative" ref={selectRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full p-[0.75vw] border rounded-xl bg-transparent text-left ${
          error ? 'border-red-500' : 'border-gray-700 dark:border-gray-500'
        } focus:outline-none focus:ring-2 disabled:bg-gray-100 disabled:cursor-not-allowed ${
          selectedOption.value === ''
            ? 'text-gray-500 dark:text-gray-400'
            : 'text-textDark dark:text-textLight'
        } text-[1vw]`}
        style={{ '--tw-ring-color': selectedColor } as React.CSSProperties}
      >
        {selectedOption.label}
        <span className="absolute right-3 top-1/2 transform -translate-y-1/2">
          ▼
        </span>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-[rgba(255,255,255,0.9)] dark:bg-[rgba(22,22,22,0.9)] border border-gray-700 dark:border-gray-500 rounded-xl shadow-lg overflow-hidden p-2">
          {options.map((option) => (
            <div
              key={option.value}
              className={`p-[0.75vw] text-[1vw] rounded-xl ${
                option.value === value
                  ? `border-2 bg-bgLight dark:bg-bgDark text-textDark dark:text-textLight cursor-pointer`
                  : option.value === ''
                  ? 'text-gray-500 dark:text-gray-400 select-none cursor-default'
                  : 'text-textDark dark:text-textLight hover:bg-bgLight dark:hover:bg-bgDark cursor-pointer'
              }`}
              style={
                option.value === value
                  ? { borderColor: selectedColor }
                  : undefined
              }
              onClick={() => {
                if (option.value !== '') {
                  onChange(option.value);
                  setIsOpen(false);
                }
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

interface CustomCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
  selectedColor: string;
  disabled?: boolean;
  id: string;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  checked,
  onChange,
  error,
  selectedColor,
  disabled = false,
  id,
}) => {
  return (
    <div
      id={id}
      role="checkbox"
      aria-checked={checked}
      tabIndex={disabled ? -1 : 0}
      onClick={() => !disabled && onChange(!checked)}
      onKeyDown={(e) => {
        if (disabled) return;
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onChange(!checked);
        }
      }}
      className={`mt-1 w-[1.25vw] h-[1.25vw] rounded border-2 flex items-center justify-center transition-colors ${
        disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
      } ${
        error
          ? 'border-red-500'
          : checked
          ? `border-[var(--selected-color)] bg-[var(--selected-color)]`
          : 'border-gray-700 dark:border-gray-500'
      } focus:outline-none focus:ring-2`}
      style={
        {
          '--tw-ring-color': selectedColor,
          '--selected-color': selectedColor,
        } as React.CSSProperties
      }
    >
      {checked && (
        <svg
          className="w-[1.5vw] h-[1.5vw] text-textDark"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
      )}
    </div>
  );
};
