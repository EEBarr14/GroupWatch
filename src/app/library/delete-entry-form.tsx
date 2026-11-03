"use client";

export function DeleteEntryForm({
  action,
  title,
}: {
  action: (formData: FormData) => void | Promise<void>;
  title: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!window.confirm(`Delete “${title}” from your library?`)) {
          event.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className="rounded-full border border-[#d65a4a]/45 px-5 py-2.5 text-sm font-bold text-[#a63e34] transition hover:bg-[#d65a4a]/10"
      >
        Delete
      </button>
    </form>
  );
}
