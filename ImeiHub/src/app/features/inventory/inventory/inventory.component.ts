import { Component, output, signal, computed, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../components/ui/button/button.component';
import { PageHeadingComponent } from '../../../components/ui/page-heading/page-heading.component';
import { InventoryToolbarComponent } from '../inventory-toolbar/inventory-toolbar.component';
import { InventoryTableComponent } from '../inventory-table/inventory-table.component';
import { InventoryFiltersSheetComponent } from '../inventory-filters-sheet/inventory-filters-sheet.component';
import { ProductDetailModalComponent } from '../product-detail-modal/product-detail-modal.component';
import { ProductAddViewComponent } from '../product-add-view/product-add-view.component';
import { ProductEditSheetComponent } from '../product-edit-sheet/product-edit-sheet.component';
import { Product } from '../../../types/inventory';
import { Overlay } from '../../../types/navigation';
import { InventoryService } from '../../../core/services/inventory.service';
import { OverlayService } from '../../../core/services/overlay.service';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    PageHeadingComponent,
    InventoryToolbarComponent,
    InventoryTableComponent,
    InventoryFiltersSheetComponent,
    ProductDetailModalComponent,
    ProductAddViewComponent,
    ProductEditSheetComponent,
  ],
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent {
  private inventoryService = inject(InventoryService);
  private overlayService = inject(OverlayService);

  open = output<Overlay>();
  notify = output<string>();

  category = signal('All');
  color = signal('All variants');
  productType = signal('All types');
  stockStatus = signal('Any stock');
  minPrice = signal('');
  maxPrice = signal('');
  sortBy = signal('Name A–Z');
  showFilters = signal(false);
  showProductDetail = signal(false);
  showEditProduct = signal(false);
  showAddProduct = signal(false);
  currentProductPage = signal(1);
  inventorySearch = signal('');
  inventorySearchOpen = signal(false);

  selected = signal<Product | null>(null);
  detailColor = signal('Estándar');

  categories = ['All', 'Smartphones', 'Laptops', 'Tablets', 'Accessories'];

  colors = computed(() => [
    'All variants',
    ...Array.from(
      new Set(
        this.inventoryService.products().flatMap((product) =>
          product.variants.map((variant) => variant.color)
        )
      )
    ),
  ]);

  productsPerPage = 5;

  activeFilterCount = computed(() => {
    return [
      this.productType() !== 'All types',
      this.color() !== 'All variants',
      this.stockStatus() !== 'Any stock',
      this.minPrice() !== '',
      this.maxPrice() !== '',
    ].filter(Boolean).length;
  });

  visible = computed(() => {
    const cat = this.category();
    const col = this.color();
    const pType = this.productType();
    const stock = this.stockStatus();
    const minP = this.minPrice();
    const maxP = this.maxPrice();
    const sort = this.sortBy();

    const filtered = this.inventoryService.products().filter((product) => {
      const price = Number(product.price.replaceAll(',', ''));
      const matchesCategory =
        cat === 'All' ||
        (cat === 'Low Stock'
          ? product.stock <= 2
          : product.type === cat);
      const matchesColor =
        col === 'All variants' ||
        product.variants.some((variant) => variant.color === col);
      const matchesType =
        pType === 'All types' || product.type === pType;
      const matchesStock =
        stock === 'Any stock' ||
        (stock === 'In stock' && product.stock > 2) ||
        (stock === 'Low stock' &&
          product.stock > 0 &&
          product.stock <= 2) ||
        (stock === 'Out of stock' && product.stock === 0);
      const matchesMin = minP === '' || price >= Number(minP);
      const matchesMax = maxP === '' || price <= Number(maxP);
      return (
        matchesCategory &&
        matchesColor &&
        matchesType &&
        matchesStock &&
        matchesMin &&
        matchesMax
      );
    });

    return filtered.sort((a, b) => {
      const priceA = Number(a.price.replaceAll(',', ''));
      const priceB = Number(b.price.replaceAll(',', ''));
      if (sort === 'Price: low to high') return priceA - priceB;
      if (sort === 'Price: high to low') return priceB - priceA;
      if (sort === 'Stock: high to low') return b.stock - a.stock;
      return a.name.localeCompare(b.name);
    });
  });

  totalProductPages = computed(() =>
    Math.max(1, Math.ceil(this.visible().length / this.productsPerPage))
  );

  paginatedProducts = computed(() => {
    const page = this.currentProductPage();
    return this.visible().slice(
      (page - 1) * this.productsPerPage,
      page * this.productsPerPage
    );
  });

  inventorySuggestions = computed(() => {
    const query = this.inventorySearch().trim().toLowerCase();
    return query
      ? this.inventoryService.products()
          .filter((p) => p.name.toLowerCase().includes(query))
          .slice(0, 6)
      : [];
  });

  constructor() {
    const prods = this.inventoryService.products();
    if (prods.length > 0) {
      this.selected.set(prods[0]);
      if (prods[0].variants.length > 0) {
        this.detailColor.set(prods[0].variants[0].color);
      }
    }

    effect(() => {
      this.category();
      this.color();
      this.productType();
      this.stockStatus();
      this.minPrice();
      this.maxPrice();
      this.sortBy();
      this.currentProductPage.set(1);
    });
  }

  onOpenOverlay(overlay: Overlay) {
    this.open.emit(overlay);
    this.overlayService.open(overlay);
  }

  resetFilters() {
    this.productType.set('All types');
    this.color.set('All variants');
    this.stockStatus.set('Any stock');
    this.minPrice.set('');
    this.maxPrice.set('');
    this.sortBy.set('Name A–Z');
  }

  onSelectSuggestion(product: Product) {
    this.selected.set(product);
    this.detailColor.set(product.variants[0]?.color || 'Estándar');
    this.showProductDetail.set(true);
    this.inventorySearch.set(product.name);
    this.inventorySearchOpen.set(false);
  }

  onSelectProduct(product: Product) {
    this.selected.set(product);
    this.detailColor.set(product.variants[0]?.color || 'Estándar');
    this.showProductDetail.set(true);
  }

  onEditProduct() {
    this.showProductDetail.set(false);
    this.showEditProduct.set(true);
  }
}
