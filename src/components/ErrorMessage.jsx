// Shows nothing when there is no message, so the page has no empty gap.
export default function ErrorMessage({ message }) {
  if (!message) return null;
  return (
    <p role="alert" className="mt-4 text-sm text-red-400">
      {message}
    </p>
  );
}
