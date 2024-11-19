import prisma from "@/lib/prisma";

export default async function FavoritesPage() {
  const favorites = await prisma.soal.findMany({
    where: { isFavorite: true },
  });

  console.log(favorites)

  return (
    <div>
      <h1>Favorite Soals</h1>
      <ul>
        {favorites.map((soal) => (
          <li key={soal.id}>
            <a href={soal.url}>{soal.soal}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
