# Prompt Gallery

A web application for managing and displaying prompts.

🔗 **Live Demo**: [http://mometec.codes/](http://mometec.codes/)

## Setup Instructions

1. Clone the repository
   ```bash
   git clone <your-repo-url>
   cd promtgallery
   ```

2. Configure the database
   ```bash
   copy config\database.example.php config\database.php
   ```
   
3. Edit `config\database.php` with your actual database credentials

4. Import the database schema (create a SQL file for this)

5. Configure your web server to point to this directory

## Security Notes

- Never commit `config/database.php` - it contains sensitive credentials
- Keep your `.gitignore` file updated
- Change default admin credentials after installation

## Project Structure

```
promtgallery/
├── admin/          # Admin panel files
├── config/         # Configuration files
├── models/         # Data models
└── ...
```

## License

This project is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License - see the [LICENSE](LICENSE) file for details.

**Non-Commercial Use Only** - This software may not be used for commercial purposes.