import { jest } from '@jest/globals';

const mockPostModel = {
  createPost: jest.fn(),
  findAll: jest.fn(),
  findById: jest.fn(),
  updatePost: jest.fn(),
  deletePost: jest.fn(),
};

jest.unstable_mockModule('../../src/models/postModel.js', () => mockPostModel);

const postService = await import('../../src/services/postService.js');

describe('postService Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('createPost deve chamar postModel.createPost', async () => {
    mockPostModel.createPost.mockResolvedValueOnce({ id: 1, titulo: 'Aviso' });
    const res = await postService.createPost({ titulo: 'Aviso', conteudo: 'Texto', autor_id: 1 });
    expect(res).toEqual({ id: 1, titulo: 'Aviso' });
    expect(mockPostModel.createPost).toHaveBeenCalledWith({ titulo: 'Aviso', conteudo: 'Texto', autor_id: 1 });
  });

  it('getPosts deve chamar postModel.findAll com options', async () => {
    mockPostModel.findAll.mockResolvedValueOnce([{ id: 1 }]);
    const res = await postService.getPosts({ forUserId: 3 });
    expect(res).toEqual([{ id: 1 }]);
    expect(mockPostModel.findAll).toHaveBeenCalledWith({ forUserId: 3 });
  });

  it('getPostById deve chamar postModel.findById', async () => {
    mockPostModel.findById.mockResolvedValueOnce({ id: 2 });
    const res = await postService.getPostById(2);
    expect(res).toEqual({ id: 2 });
    expect(mockPostModel.findById).toHaveBeenCalledWith(2);
  });

  it('updatePost deve chamar postModel.updatePost', async () => {
    mockPostModel.updatePost.mockResolvedValueOnce({ id: 2, titulo: 'Atualizado' });
    const res = await postService.updatePost(2, { titulo: 'Atualizado', conteudo: 'Novo' });
    expect(res).toEqual({ id: 2, titulo: 'Atualizado' });
    expect(mockPostModel.updatePost).toHaveBeenCalledWith(2, { titulo: 'Atualizado', conteudo: 'Novo' });
  });

  it('deletePost deve chamar postModel.deletePost', async () => {
    mockPostModel.deletePost.mockResolvedValueOnce(true);
    const res = await postService.deletePost(2);
    expect(res).toBe(true);
    expect(mockPostModel.deletePost).toHaveBeenCalledWith(2);
  });
});
