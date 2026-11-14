// Shows nothing when there is no message. When there is one, it is announced to screen readers.
export default function ErrorMessage({ message }) {
  if (!message) return null;
  return (
    <p role="alert" className="error">
      {message}
    </p>
  );
}
