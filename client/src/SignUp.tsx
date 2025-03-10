import { useState } from 'react';
import { HiOutlineLockClosed, HiOutlineMail } from 'react-icons/hi';
import TextInputComponent from './TextInputComponent';
import { Button } from '@nextui-org/react';

interface FormData {
  email?: string;
  password?: string;
}

export default function SignUp() {
  const [formData, setFormData] = useState<FormData>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      return setErrorMessage('Please fill out all fields');
    }

    try {
      setLoading(true);
      setErrorMessage(null);

      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        setErrorMessage(data.message || 'Something went wrong');
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen mt-20 fixed top-0 left-0 w-full z-[10000000]">
      <div className="flex p-3 max-w-3xl mx-auto flex-col xl:flex-row gap-5">
        {/* left */}
        <div className="flex-1 self-center">
          <p className="text-sm mt-5">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry
          </p>
        </div>
        {/* right */}
        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <TextInputComponent
              onChange={handleChange}
              type="email"
              id="email"
              label="Email"
              startContent={<HiOutlineMail />}
            />

            <TextInputComponent
              onChange={handleChange}
              type="password"
              id="password"
              label="Password"
              isPasswordInput
              startContent={<HiOutlineLockClosed />}
            />

            <Button type="submit" isLoading={loading} disabled={loading}>
              Sign Up
            </Button>
          </form>

          {errorMessage && errorMessage}
        </div>
      </div>
    </div>
  );
}
