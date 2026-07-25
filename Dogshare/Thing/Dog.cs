namespace DogShare.Thing
{
    public class Dog
    {
        public int id { get; set; }
        public required string Name { get; set; }

        public required int Age { get; set; }

        public required string Breed { get; set; }

        public required string OwnerName { get; set; }

        public required string Image { get; set; }

        public int FavoriteToyIMG { get; set; }

        public string? FavoriteFood { get; set; }

        public string? OwnerId { get; set; }

        public virtual User? Owner { get; set; }
    }
}
