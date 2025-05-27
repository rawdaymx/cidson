export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f4f6fb]">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-[#303e65] border-t-[#f5d433] rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-gray-600">Cargando información...</p>
      </div>
    </div>
  );
}
