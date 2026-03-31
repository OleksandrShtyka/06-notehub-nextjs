'use client';

interface ErrorMessageProps {
  error: Error;
}

export default function ErrorMessage({ error }: ErrorMessageProps) {
  return <p>Something went wrong. {error.message}</p>;
}
