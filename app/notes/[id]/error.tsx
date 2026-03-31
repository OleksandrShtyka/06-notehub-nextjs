'use client';

interface ErrorMessageProps {
  error: Error;
}

export default function ErrorMessage({ error }: ErrorMessageProps) {
  return <p>Could not fetch note details. {error.message}</p>;
}
