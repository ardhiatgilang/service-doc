import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-1 flex-col items-center justify-center gap-8 px-4 py-10 sm:gap-10 sm:px-6 sm:py-16">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/30 sm:h-16 sm:w-16">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            className="h-7 w-7 sm:h-8 sm:w-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 9a2 2 0 0 1 2-2h1.5l1-1.5h9l1 1.5H19a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"
            />
            <circle cx="12" cy="13" r="3.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">Service Doc</h1>
        <p className="max-w-xs text-sm text-slate-500 sm:max-w-sm">
          Dokumentasi servis teknisi — upload foto per project, pantau kelengkapan,
          dan kelola semuanya dari satu tempat.
        </p>
      </div>

      <div className="grid w-full max-w-sm gap-4 sm:max-w-2xl sm:grid-cols-2 sm:gap-5">
        <Link
          href="/teknisi/login"
          className="group flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow-md sm:p-6"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white sm:h-11 sm:w-11">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              className="h-5 w-5 sm:h-6 sm:w-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 20c0-3.5 3.5-6 8-6s8 2.5 8 6" />
            </svg>
          </span>
          <div>
            <h2 className="text-sm font-semibold text-slate-900 sm:text-base">
              Masuk sebagai Teknisi
            </h2>
            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              Upload dokumentasi foto servis menggunakan NIP.
            </p>
          </div>
        </Link>

        <Link
          href="/admin/login"
          className="group flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow-md sm:p-6"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition group-hover:bg-slate-900 group-hover:text-white sm:h-11 sm:w-11">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              className="h-5 w-5 sm:h-6 sm:w-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 5h16M4 12h16M4 19h10" />
            </svg>
          </span>
          <div>
            <h2 className="text-sm font-semibold text-slate-900 sm:text-base">
              Masuk sebagai Admin Support
            </h2>
            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              Kelola project, pantau progres, dan unduh dokumentasi.
            </p>
          </div>
        </Link>
      </div>
    </main>
  );
}
