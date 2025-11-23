<script>
  import { Sidebar, SidebarGroup, SidebarItem, SidebarWrapper, Drawer, CloseButton } from 'flowbite-svelte';
  import { Navbar, NavBrand, NavLi, NavUl, NavHamburger, Avatar, Dropdown, DropdownItem, DropdownHeader, DropdownDivider } from 'flowbite-svelte';
  import { sineIn } from 'svelte/easing';
  
  let hidden = true;
  let spanClass = 'flex-1 ml-3 whitespace-nowrap';
  
  let transitionParams = {
    x: -320,
    duration: 200,
    easing: sineIn
  };

  const toggleDrawer = () => {
    hidden = !hidden;
  };
</script>

<div class="flex h-screen overflow-hidden">
  <!-- Sidebar for desktop -->
  <aside class="hidden lg:flex w-64 flex-shrink-0">
    <Sidebar>
      <SidebarWrapper>
        <SidebarGroup>
          <SidebarItem label="Dashboard" href="/admin/dashboard">
            <svelte:fragment slot="icon">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
                <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
              </svg>
            </svelte:fragment>
          </SidebarItem>
          
          <SidebarItem label="Products" href="/admin/products">
            <svelte:fragment slot="icon">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path>
              </svg>
            </svelte:fragment>
          </SidebarItem>

          <SidebarItem label="Prompts" href="/admin/prompts">
            <svelte:fragment slot="icon">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clip-rule="evenodd"></path>
              </svg>
            </svelte:fragment>
          </SidebarItem>

          <SidebarItem label="Rules" href="/admin/rules">
            <svelte:fragment slot="icon">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"></path>
              </svg>
            </svelte:fragment>
          </SidebarItem>

          <SidebarItem label="Chat" href="/chat">
            <svelte:fragment slot="icon">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clip-rule="evenodd"></path>
              </svg>
            </svelte:fragment>
          </SidebarItem>
        </SidebarGroup>
      </SidebarWrapper>
    </Sidebar>
  </aside>

  <!-- Drawer for mobile -->
  <Drawer transitionType="fly" {transitionParams} bind:hidden id="sidebar">
    <div class="flex items-center">
      <h5 class="text-base font-semibold text-gray-500 uppercase dark:text-gray-400">Menu</h5>
      <CloseButton on:click={toggleDrawer} class="mb-4 dark:text-white" />
    </div>
    <Sidebar>
      <SidebarWrapper>
        <SidebarGroup>
          <SidebarItem label="Dashboard" href="/admin/dashboard" on:click={toggleDrawer}>
            <svelte:fragment slot="icon">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
                <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
              </svg>
            </svelte:fragment>
          </SidebarItem>
          
          <SidebarItem label="Products" href="/admin/products" on:click={toggleDrawer}>
            <svelte:fragment slot="icon">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path>
              </svg>
            </svelte:fragment>
          </SidebarItem>

          <SidebarItem label="Prompts" href="/admin/prompts" on:click={toggleDrawer}>
            <svelte:fragment slot="icon">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clip-rule="evenodd"></path>
              </svg>
            </svelte:fragment>
          </SidebarItem>

          <SidebarItem label="Rules" href="/admin/rules" on:click={toggleDrawer}>
            <svelte:fragment slot="icon">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"></path>
              </svg>
            </svelte:fragment>
          </SidebarItem>

          <SidebarItem label="Chat" href="/chat" on:click={toggleDrawer}>
            <svelte:fragment slot="icon">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clip-rule="evenodd"></path>
              </svg>
            </svelte:fragment>
          </SidebarItem>
        </SidebarGroup>
      </SidebarWrapper>
    </Sidebar>
  </Drawer>

  <!-- Main content area -->
  <div class="flex-1 flex flex-col overflow-hidden">
    <!-- Top Navbar -->
    <Navbar let:hidden let:toggle fluid={true}>
      <NavBrand href="/admin/dashboard">
        <span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          Nông Lâm Viên Admin
        </span>
      </NavBrand>
      
      <div class="flex items-center gap-3 md:order-2">
        <Avatar id="avatar-menu" src="https://flowbite.com/docs/images/people/profile-picture-3.jpg" dot={{color:'green'}} rounded />
        <Dropdown placement="bottom" triggeredBy="#avatar-menu">
          <DropdownHeader>
            <span class="block text-sm">Admin User</span>
            <span class="block truncate text-sm font-medium">admin@nonglam.com</span>
          </DropdownHeader>
          <DropdownItem>Dashboard</DropdownItem>
          <DropdownItem>Settings</DropdownItem>
          <DropdownDivider />
          <DropdownItem>Sign out</DropdownItem>
        </Dropdown>
        <NavHamburger on:click={toggleDrawer} class1="w-full md:flex md:w-auto md:order-1 lg:hidden" />
      </div>
    </Navbar>

    <!-- Page content -->
    <main class="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-4">
      <slot />
    </main>
  </div>
</div>
