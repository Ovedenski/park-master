import Link from "next/link";

export default function notFound() {
  return (
      <main className="grid min-h-full place-items-center  px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center">
          <p className="text-base font-semibold text-white">404</p>
          <h1 className="mt-4 text-5xl font-semibold tracking-tight text-balance text-dark sm:text-7xl">
            Не намираме страницата
          </h1>
          <p className="mt-6 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
            Тук не се паркира!
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/"
              className="rounded-md bg-white px-3.5 py-2.5 text-sm text-black shadow-xs hover:bg-gray-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              Начало
            </Link>
          </div>
        </div>
      </main>
  )
}