class BaseUseCase:
    def __init__(self, repository):
        self.repository = repository

    def execute(self):
        raise NotImplementedError
