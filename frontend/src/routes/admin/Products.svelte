<script>
  import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, Button, Card, Heading, Input, Label, Modal } from 'flowbite-svelte';
  import { onMount } from 'svelte';

  let products = [];
  let loading = true;
  let showModal = false;
  let editingProduct = null;

  let formData = {
    name: '',
    description: '',
    price: '',
    category: ''
  };

  onMount(async () => {
    await fetchProducts();
  });

  async function fetchProducts() {
    try {
      loading = true;
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8787';
      const response = await fetch(`${apiUrl}/api/products`);
      const data = await response.json();
      products = data.products || [];
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      loading = false;
    }
  }

  function openAddModal() {
    editingProduct = null;
    formData = { name: '', description: '', price: '', category: '' };
    showModal = true;
  }

  function openEditModal(product) {
    editingProduct = product;
    formData = { ...product };
    showModal = true;
  }

  async function saveProduct() {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8787';
      const method = editingProduct ? 'PUT' : 'POST';
      const url = editingProduct 
        ? `${apiUrl}/api/products/${editingProduct.id}`
        : `${apiUrl}/api/products`;

      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      showModal = false;
      await fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
    }
  }

  async function deleteProduct(id) {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8787';
      await fetch(`${apiUrl}/api/products/${id}`, { method: 'DELETE' });
      await fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  }
</script>

<div class="space-y-6">
  <div class="flex justify-between items-center">
    <Heading tag="h1" class="text-2xl font-bold">Products Management</Heading>
    <Button on:click={openAddModal} color="green">Add Product</Button>
  </div>

  <Card>
    {#if loading}
      <p class="text-center py-8">Loading...</p>
    {:else if products.length === 0}
      <p class="text-center py-8 text-gray-500">No products found</p>
    {:else}
      <Table>
        <TableHead>
          <TableHeadCell>ID</TableHeadCell>
          <TableHeadCell>Name</TableHeadCell>
          <TableHeadCell>Description</TableHeadCell>
          <TableHeadCell>Price</TableHeadCell>
          <TableHeadCell>Category</TableHeadCell>
          <TableHeadCell>Actions</TableHeadCell>
        </TableHead>
        <TableBody>
          {#each products as product}
            <TableBodyRow>
              <TableBodyCell>{product.id}</TableBodyCell>
              <TableBodyCell>{product.name}</TableBodyCell>
              <TableBodyCell>{product.description || '-'}</TableBodyCell>
              <TableBodyCell>${product.price}</TableBodyCell>
              <TableBodyCell>{product.category || '-'}</TableBodyCell>
              <TableBodyCell>
                <div class="flex gap-2">
                  <Button size="xs" color="blue" on:click={() => openEditModal(product)}>Edit</Button>
                  <Button size="xs" color="red" on:click={() => deleteProduct(product.id)}>Delete</Button>
                </div>
              </TableBodyCell>
            </TableBodyRow>
          {/each}
        </TableBody>
      </Table>
    {/if}
  </Card>
</div>

<Modal bind:open={showModal} title={editingProduct ? 'Edit Product' : 'Add Product'}>
  <form on:submit|preventDefault={saveProduct} class="space-y-4">
    <div>
      <Label for="name">Name</Label>
      <Input id="name" bind:value={formData.name} required />
    </div>
    <div>
      <Label for="description">Description</Label>
      <Input id="description" bind:value={formData.description} />
    </div>
    <div>
      <Label for="price">Price</Label>
      <Input id="price" type="number" step="0.01" bind:value={formData.price} required />
    </div>
    <div>
      <Label for="category">Category</Label>
      <Input id="category" bind:value={formData.category} />
    </div>
    <div class="flex justify-end gap-2">
      <Button color="alternative" on:click={() => showModal = false}>Cancel</Button>
      <Button type="submit" color="green">Save</Button>
    </div>
  </form>
</Modal>
