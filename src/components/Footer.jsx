export function Footer() {
  return (
    <>
      <footer className="bg-white border-t py-3 px-4 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Task Manager. All rights reserved.
      </footer>
    </>
  );
}
