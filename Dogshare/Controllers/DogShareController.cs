using DogShare.Thing;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Dogshare.Thing;
using System.Threading.Tasks;
using Microsoft.Identity.Client;


namespace Dogshare.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DogShareController : ControllerBase
    {
        private readonly DBcontext _context;

        public DogShareController(DBcontext context)
        {
            _context = context;
        }

        [Authorize]
        [HttpPost("addDog")]
        public ActionResult<Dog> AddDog(DogDTO dogDto)
        {
            var ownerId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? string.Empty;

            var dog = new Dog
            {
                Name = dogDto.Name,
                Age = dogDto.Age,
                Breed = dogDto.Breed,
                OwnerName = dogDto.OwnerName,
                Image = dogDto.Image,
                FavoriteToyIMG = dogDto.FavoriteToyIMG,
                FavoriteFood = dogDto.FavoriteFood,
                OwnerId = ownerId
            };

            _context.Dogs.Add(dog);
            _context.SaveChanges();
            return Ok(dog);
        }

        [HttpGet("getDogs")]
        public async Task<ActionResult<IEnumerable<Dog>>> GetDogs()
        {
            var dogs = await _context.Dogs.ToListAsync();
            return Ok(dogs);
        }


        [Authorize]
        [HttpPost("AddPost")]
        public async Task<ActionResult<IEnumerable<Post>>> AddPost(PostDTO postdto)
        {
            var ownerId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(ownerId))
            {
                return Unauthorized("User ID could not be found in the current session token.");
            }
            Post post = new Post
            {
                Title = postdto.Title,
                Description = postdto.Description,
                Image = postdto.Image,
                DatePosted = DateTime.UtcNow,
                AuthorId = ownerId
            };

            _context.Posts.Add(post);
            _context.SaveChanges();
            return Ok(post);
        }
        [Authorize]
        [HttpPost("like/{postId}")]
        public async Task<ActionResult<Post>> LikePost(int postId)
        {

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("You must be logged in to like a post.");
            }


            var post = await _context.Posts.FindAsync(postId);
            if (post == null)
            {
                return NotFound("Post not found.");
            }

            bool hasLiked = await _context.PostLikes
              .AnyAsync(pl => pl.UserId == userId && pl.PostId == postId);

            if (hasLiked)
            {
                return BadRequest("You have already liked this post.");
            }


            var postLike = new PostLike
            {
                UserId = userId,
                PostId = postId
            };
            _context.PostLikes.Add(postLike);


            post.Likes += 1;


            await _context.SaveChangesAsync();

            return Ok(post);
        }

        [Authorize]
        [HttpDelete("unlike/{postId}")]
        public async Task<ActionResult<Post>> UnlikePost(int postId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("You must be logged in to unlike a post.");
            }
            var post = await _context.Posts.FindAsync(postId);
            if (post == null)
            {
                return NotFound("Post not found.");
            }
            var postLike = await _context.PostLikes
                .FirstOrDefaultAsync(pl => pl.UserId == userId && pl.PostId == postId);
            if (postLike == null)
            {
                return BadRequest("You have not liked this post yet.");
            }
            _context.PostLikes.Remove(postLike);
            post.Likes -= 1;
            await _context.SaveChangesAsync();
            return Ok(post);
        }

        [Authorize]
        [HttpPost("comment/{postId}")]
        public async Task<ActionResult<Comment>> AddComment(int postId, CommentDTO commentDto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("You must be logged in to comment on a post.");
            }
            var post = await _context.Posts.FindAsync(postId);
            if (post == null)
            {
                return NotFound("Post not found.");
            }
            var comment = new Comment
            {
                CommentText = commentDto.Content,
                DateCommented = DateTime.UtcNow,
                AuthorId = userId,
                PostId = postId
            };


            _context.Comments.AddAsync(comment);
            await _context.SaveChangesAsync();
            return Ok(new
            {
                comment.id,
                comment.CommentText,
                comment.DateCommented,
                comment.AuthorId,
                comment.PostId
            });



            //TODO: fix Comments, configure everything and do frontend
        }


        [HttpGet("AllPosts")]
        public async Task<ActionResult<Post>> GetAllPosts()
        {
            var posts = await _context.Posts
        .Select(p => new
        {
            p.id, 
            p.Title,
            p.Description,
            p.Image,
            p.Likes,
            p.DatePosted,
            p.AuthorId,
            Comments = p.Comments.Select(c => new
            {
                c.id, 
                c.CommentText,
                c.DateCommented,
                c.AuthorId,
                c.PostId
            }).ToList()
        })
        .ToListAsync();

            return Ok(posts);
        }

        [Authorize]
        [HttpGet("UserInfo")]
        public async Task<ActionResult<User>> GetUserInfo()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("You must be logged in to view user information.");
            }
            var user = await _context.Users
                .Where(u => u.Id == userId)
                .Select(u => new
                {
                    u.Id,
                    u.UserName,
                    u.Email
                })
                .FirstOrDefaultAsync();
            if (user == null)
            {
                return NotFound("User not found.");
            }
            return Ok(user);
        }

        [HttpGet("author/{authorId}")]
        public async Task<ActionResult<User>> GetAuthorById(string authorId)
        {
            var user = await _context.Users
                .Where(u => u.Id == authorId)
                .Select(u => new
                {
                    u.Id,
                    u.UserName,
                    u.Email
                })
                .FirstOrDefaultAsync();
            if (user == null)
            {
                return NotFound("User not found.");
            }
            return Ok(user);
        }

        [HttpDelete("deletePostall")]
        public async Task<IActionResult> DeletePost()
        {
            _context.Posts.RemoveRange(_context.Posts);
            _context.PostLikes.RemoveRange(_context.PostLikes);
            _context.Comments.RemoveRange(_context.Comments);
            _context.SaveChanges();
            return Ok();
        }

        [HttpDelete("deletePost/{postId}")]
        public async Task<IActionResult> DeletePost(int postId)
        {
            var post = await _context.Posts.FindAsync(postId);
            if (post == null)
            {
                return NotFound("Post not found.");
            }
            var likes = _context.PostLikes.Where(pl => pl.PostId == postId);
            _context.PostLikes.RemoveRange(likes);
            var comments = _context.Comments.Where(c => c.PostId == postId);
            _context.Comments.RemoveRange(comments);
            _context.Posts.Remove(post);
            await _context.SaveChangesAsync();
            return Ok();
        }
    }
}
