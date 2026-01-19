# Contributing to Procedural World Generation

Thank you for your interest in contributing to the Procedural World Generation project! We welcome contributions from the community to help improve this engine.

## Development Workflow

1.  **Fork the Repository**: Create a fork of the repository to your own GitHub account.
2.  **Clone the Repository**: Clone your fork to your local machine.
    ```bash
    git clone https://github.com/your-username/procedural-generation.git
    ```
3.  **Create a Branch**: Create a new branch for your feature or bug fix.
    ```bash
    git checkout -b feature/amazing-feature
    ```
4.  **Make Changes**: Implement your changes, adhering to the project's coding standards.
5.  **Test Your Changes**: Ensure that your changes work as expected and strictly verify that no existing functionality is broken.
6.  **Commit Changes**: Commit your changes with clear and descriptive messages.
    ```bash
    git commit -m "feat: Add amazing feature"
    ```
7.  **Push to Branch**: Push your changes to your forked repository.
    ```bash
    git push origin feature/amazing-feature
    ```
8.  **Open a Pull Request**: Submit a Pull Request (PR) to the `main` branch of the original repository.

## Coding Standards

-   **Style**: Follow the existing code style. We use **Prettier** for formatting.
-   **Structure**: Keep components modular and reusable. Place engine logic in `$lib/engine`.
-   **Performance**: Since this is a procedural generation engine, prioritize performance and memory efficiency.
-   **Commits**: Use [Conventional Commits](https://www.conventionalcommits.org/) for commit messages.

## Reporting Issues

If you encounter any bugs or have feature requests, please open an issue on the repository. Provide as much detail as possible, including steps to reproduce the issue.

## License

By contributing, you agree that your contributions will be licensed under the project's [LICENSE](./LICENSE).
